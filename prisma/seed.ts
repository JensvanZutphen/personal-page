import { PrismaClient, Customer_status, Visit_status, User_role } from '@prisma/client';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const scrypt = promisify(_scrypt);
const prisma = new PrismaClient();

async function main() {
	console.time('Seeding process');
	console.log('Starting the high-speed seeding process from seed.json...');

	// --- Clear existing data ---
	console.log('Deleting existing data...');
	await prisma.actionItem.deleteMany();
	await prisma.alert.deleteMany();
	await prisma.complaint.deleteMany();
	await prisma.invoice.deleteMany();
	await prisma.mailingListMembership.deleteMany();
	await prisma.mailingList.deleteMany();
	await prisma.payment.deleteMany();
	await prisma.quoteItem.deleteMany();
	await prisma.quote.deleteMany();
	await prisma.visit.deleteMany();
	await prisma.contactPerson.deleteMany();
	await prisma.deliveryAddress.deleteMany();
	await prisma.session.deleteMany();
	await prisma.customer.deleteMany();
	await prisma.user.deleteMany();
	console.log('Existing data deleted.');

	// Load seed data from JSON file
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const seedDataPath = path.join(__dirname, 'seed.json');
	if (!fs.existsSync(seedDataPath)) {
		console.error('seed.json not found!');
		process.exit(1);
	}
	const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));
	const data = seedData.data[0];

	// Extract data tables from the JSON structure
	const H_gebruikers = data.H_gebruikers.H_gebruikers;
	const H_debiteuren = data.H_debiteuren.H_debiteuren;
	const H_contactpersonen = data.H_debiteuren_contactpersonen.H_debiteuren_contactpersonen;
	const H_aflever_adressen = data.H_debiteuren_aflever_adres.H_debiteuren_aflever_adres;
	const H_notities = data.H_debiteuren_notities.H_debiteuren_notities;
	const H_woonplaatsen = data.H_woonplaats_algemeen.H_woonplaats_algemeen;
	const H_landen = data.H_landen.H_landen;

	// Create lookup maps for cities and countries for easy access
	const woonplaatsenMap: Map<number, string> = new Map(H_woonplaatsen.map((w: any) => [w.woonplaats_nr, w.woonplaats_naam]));
	const landenMap: Map<number, string> = new Map(H_landen.map((l: any) => [l.land_nr, l.land_naam]));

	// Create a map of the latest notitie_datum for each customer
	const lastContactDateMap = new Map<number, Date>();
	H_notities.forEach((notitie: any) => {
		if (notitie.notitie_datum) {
			const newDate = new Date(notitie.notitie_datum);
			if (!isNaN(newDate.getTime())) {
				const existingDate = lastContactDateMap.get(notitie.deb_nr);
				if (!existingDate || newDate > existingDate) {
					lastContactDateMap.set(notitie.deb_nr, newDate);
				}
			}
		}
	});

	// --- Prepare User Data ---
	console.log('Preparing user data...');
	const salt = randomBytes(32);
	const hash = (await scrypt('password123', salt, 64)) as Buffer;
	const passwordHash = salt.toString('hex') + ':' + hash.toString('hex');
	
	const usersToCreate = H_gebruikers
		.filter((user: any) => !user.gebruiker_deleted)
		.map((user: any) => ({
			id: String(user.gebruiker_nr),
			username: user.gebruiker_code2 || user.gebruiker_code,
			passwordHash: passwordHash,
			name: user.gebruiker_naam,
			email: user.gebruiker_email || null,
			role: user.gebruiker_naam.toLowerCase().includes('admin') ? User_role.ADMIN : User_role.SALESPERSON,
			isActive: !user.gebruiker_deleted
		}));
	
	await prisma.user.createMany({ data: usersToCreate, skipDuplicates: true });
	console.log(`Created ${usersToCreate.length} users.`);
	
	const userMap = new Map(usersToCreate.map(u => [Number(u.id), u]));

	// --- Prepare Customer Data ---
	console.log('Preparing customer data...');
	const customersToCreate = H_debiteuren.map((debiteur: any) => {
		const responsibleUser = userMap.get(debiteur.deb_segment_leider) as { name: string | null } | undefined;
		return {
			legacyId: debiteur.deb_nr,
			name: debiteur.deb_naam,
			companyName: debiteur.deb_naam,
			street: debiteur.deb_adres_algemeen || null,
			postalCode: debiteur.deb_postcode_algemeen || null,
			city: woonplaatsenMap.get(debiteur.deb_plaats_algemeen) || null,
			country: landenMap.get(debiteur.deb_land_nr_algemeen) || null,
			status: (debiteur.debiteur_vervallen ? 'INACTIVE' : 'ACTIVE') as Customer_status,
			notes: debiteur.deb_klant_info || null,
			responsibleSalespersonName: responsibleUser ? responsibleUser.name : null,
			paymentTerms: debiteur.deb_uitloopdagen_betalingsafspraak ? `${debiteur.deb_uitloopdagen_betalingsafspraak} dagen` : null,
			lastContactDate: lastContactDateMap.get(debiteur.deb_nr) || null
		};
	});
	
	await prisma.customer.createMany({ data: customersToCreate });
	console.log(`Created ${customersToCreate.length} customers.`);

	const createdCustomers = await prisma.customer.findMany({ select: { id: true, legacyId: true } });
	const customerLegacyIdToIdMap = new Map(createdCustomers.map(c => [c.legacyId, c.id]));
	
	// --- Prepare Contact Persons ---
	console.log('Preparing contact persons...');
	const contactsToCreate = H_contactpersonen
		.filter((contact: any) => !contact.verwijderd && customerLegacyIdToIdMap.has(contact.deb_nr))
		.map((contact: any) => ({
			customerId: customerLegacyIdToIdMap.get(contact.deb_nr)!,
			name: contact.deb_cpers_naam,
			email: contact.deb_cpers_email,
			phone: contact.deb_cpers_telefoon || contact.deb_cpers_mobiel,
			isPrimary: contact.deb_cpers_default
		}));

	await prisma.contactPerson.createMany({ data: contactsToCreate });
	console.log(`Created ${contactsToCreate.length} contact persons.`);
	
	// --- Prepare Delivery Addresses ---
	console.log('Preparing delivery addresses...');
	const addressesToCreate = H_aflever_adressen
		.filter((adres: any) => !adres.verwijderd && customerLegacyIdToIdMap.has(adres.deb_nr))
		.map((adres: any) => ({
			customerId: customerLegacyIdToIdMap.get(adres.deb_nr)!,
			name: adres.deb_aflever_omschrijving,
			street: adres.deb_aflever_adres,
			postalCode: adres.deb_aflever_postcode,
			city: woonplaatsenMap.get(adres.deb_aflever_plaats) || '',
			country: landenMap.get(adres.deb_aflever_land_nr) || 'Nederland',
			isPrimary: adres.deb_aflever_default
		}));

	await prisma.deliveryAddress.createMany({ data: addressesToCreate });
	console.log(`Created ${addressesToCreate.length} delivery addresses.`);
	
	// --- Prepare Visits ---
	console.log('Preparing visits...');
	const visitsToCreate = H_notities
		.filter((notitie: any) => !notitie.verwijderd && notitie.notitie_soort === 'BEZ' && customerLegacyIdToIdMap.has(notitie.deb_nr) && userMap.has(notitie.ingevoerd_door))
		.map((notitie: any) => ({
			customerId: customerLegacyIdToIdMap.get(notitie.deb_nr)!,
			visitDateTime: new Date(notitie.notitie_datum),
			purpose: notitie.referentie,
			summary: notitie.omschrijving,
			createdById: String(notitie.ingevoerd_door),
			status: 'COMPLETED' as Visit_status
		}));

	await prisma.visit.createMany({ data: visitsToCreate });
	console.log(`Created ${visitsToCreate.length} visits.`);
	
	console.timeEnd('Seeding process');
}

main()
	.catch((e) => {
		console.error('An error occurred during seeding:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	}); 