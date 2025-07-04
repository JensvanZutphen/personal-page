// In a real application, this would be your database.
// For this example, we'll keep a small in-memory "database"
// that can be shared across different server routes for consistent demo data.

export const sampleCustomers = [
	{
		id: 1,
		name: 'Willem Haverkamp',
		company: 'Haverkamp Houthandel',
		email: 'willem@haverkamphout.nl',
		phone: '+31 20 123 4567',
		status: 'active',
		lastContact: '2024-01-15',
		address: 'Houtzagerslaan 45, 1234 AB Almere',
		notes: 'Grote afnemer van vuurhout. Wekelijkse leveringen voor retail verkoop.',
		contactPerson: {
			name: 'Willem Haverkamp',
			email: 'willem@haverkamphout.nl',
			phone: '+31 20 123 4568'
		},
		responsibleSalesperson: 'Marco van der Berg',
		orderFrequency: 'Wekelijks',
		visitFrequencyDesired: 'Elke 2 weken',
		visitFrequencyHistory: 'Gemiddeld 1x per week voor kwaliteitscontrole',
		futurePlans:
			'Uitbreiding assortiment vuurhout, nieuwe showroom voor particulieren gepland Q3 2024',
		birthday: '1975-03-15',
		children: 'Twee kinderen die meelopen in de zaak: Lisa (22), Tom (19)',
		paymentTerms: '30 dagen netto',
		paymentHistory: 'Altijd op tijd'
	},
	{
		id: 2,
		name: 'Sandra Molenaar',
		company: 'Camping De Bosrand',
		email: 'sandra@campingbosrand.nl',
		phone: '+31 30 987 6543',
		status: 'active',
		lastContact: '2024-01-12',
		address: 'Natuurpark 78, 3500 CD Putten',
		notes:
			'Seizoensklant voor kampvuurhout en aanmaakhout. Hoge kwaliteitseisen voor droog vuurhout.',
		contactPerson: {
			name: 'Sandra Molenaar',
			email: 'sandra@campingbosrand.nl',
			phone: '+31 30 987 6543'
		},
		responsibleSalesperson: 'Linda de Wit',
		orderFrequency: 'Seizoensgebonden',
		visitFrequencyDesired: 'Maandelijks in seizoen',
		visitFrequencyHistory: 'Maart-oktober wekelijks, winter kwartaal',
		futurePlans:
			'Uitbreiding met glamping, meer vraag naar premium vuurhout, kwaliteitscertificering gewenst',
		birthday: '1982-07-22',
		children: 'Geen kinderen',
		paymentTerms: '14 dagen netto',
		paymentHistory: 'Meestal op tijd, seizoensbetalingen'
	},
	{
		id: 3,
		name: 'Kees van der Meer',
		company: 'Restaurant De Houtstook',
		email: 'kees@houtstook.nl',
		phone: '+31 50 111 2222',
		status: 'prospect',
		lastContact: '2024-01-08',
		address: 'Restaurantplein 12, 9700 AB Groningen',
		notes: 'Nieuw restaurant met houtgestookte oven. Interesse in vuurhout van hoge kwaliteit.',
		contactPerson: {
			name: 'Kees van der Meer',
			email: 'kees@houtstook.nl',
			phone: '+31 50 111 2223'
		},
		responsibleSalesperson: 'Marco van der Berg',
		orderFrequency: 'Nog niet van toepassing',
		visitFrequencyDesired: '2x per maand',
		visitFrequencyHistory: 'Nieuwe prospect',
		futurePlans: 'Opening tweede restaurant, zoekt betrouwbare leverancier voor vuurhout',
		birthday: '1968-11-03',
		children: 'Drie kinderen, zoon werkt als kok mee',
		paymentTerms: 'Nog niet bepaald',
		paymentHistory: 'Nieuwe klant'
	},
	{
		id: 4,
		name: 'Anna Bosch',
		company: 'Bosch Tuincentrum',
		email: 'anna@boschtuinen.nl',
		phone: '+31 40 333 4444',
		status: 'active',
		lastContact: '2024-01-10',
		address: 'Tuinlaan 88, 5600 XY Eindhoven',
		notes: 'Verkoopt vuurhout aan particulieren. Seizoensgebonden inkoop van oktober-maart.',
		contactPerson: {
			name: 'Rob Bosch',
			email: 'rob@boschtuinen.nl',
			phone: '+31 40 333 4445'
		},
		responsibleSalesperson: 'Linda de Wit',
		orderFrequency: 'Seizoensgebonden',
		visitFrequencyDesired: 'Wekelijks in seizoen',
		visitFrequencyHistory: 'September-maart wekelijks, zomer maandelijks',
		futurePlans: 'Uitbreiding vuurhout-afdeling, interesse in aanmaakhout en accessoires',
		birthday: '1977-05-18',
		children: 'Een dochter (15) die bijklust in het tuincentrum',
		paymentTerms: '21 dagen netto',
		paymentHistory: 'Betrouwbaar, betaalt altijd binnen termijn'
	},
	{
		id: 5,
		name: 'Erik Timmer',
		company: 'Timmer Houtzagerij',
		email: 'erik@timmerhout.com',
		phone: '+31 70 555 6666',
		status: 'inactive',
		lastContact: '2023-11-20',
		address: 'Industrieweg 234, 2600 GA Delft',
		notes: 'Voormalige klant. Contract beëindigd vanwege overstap naar eigen productie.',
		contactPerson: {
			name: 'Erik Timmer',
			email: 'erik@timmerhout.com',
			phone: '+31 70 555 6666'
		},
		responsibleSalesperson: 'Marco van der Berg',
		orderFrequency: 'Was wekelijks',
		visitFrequencyDesired: 'Geen bezoeken gewenst',
		visitFrequencyHistory: 'Was 1x per maand',
		futurePlans: 'Mogelijk herstart samenwerking voor vuurhout levering',
		birthday: '1985-09-12',
		children: 'Geen kinderen',
		paymentTerms: 'Was 30 dagen netto',
		paymentHistory: 'Altijd correct betaald'
	}
];

export const sampleVisits = [
	{
		id: 1,
		customerId: 1,
		date: '2024-01-15',
		time: '09:00',
		type: 'Leveringscontrole',
		status: 'voltooid',
		duration: 45,
		purpose: 'Controle kwaliteit vuurhout levering - 15m³',
		notes: 'Klant zeer tevreden met droogtegraad van het vuurhout. Volgende levering 25 januari.',
		location: 'Haverkamp Houthandel, Almere'
	},
	{
		id: 2,
		customerId: 1,
		date: '2024-01-08',
		time: '14:30',
		type: 'Commercieel bezoek',
		status: 'voltooid',
		duration: 60,
		purpose: 'Seizoensplanning en nieuwe vuurhout producten',
		notes: 'Interesse in grotere volumes vuurhout voor retail. Offerte aangevraagd.',
		location: 'Haverkamp Houthandel, Almere'
	},
	{
		id: 3,
		customerId: 1,
		date: '2024-02-01',
		time: '10:00',
		type: 'Offerte bespreking',
		status: 'gepland',
		duration: 30,
		purpose: 'Bespreking offerte 50m³ vuurhout voor Q1',
		notes: '',
		location: 'Haverkamp Houthandel, Almere'
	},
	{
		id: 4,
		customerId: 2,
		date: '2024-01-12',
		time: '11:00',
		type: 'Leveringscontrole',
		status: 'voltooid',
		duration: 30,
		purpose: 'Levering kampvuurhout - controle vochtpercentage',
		notes: 'Vocht onder 18%, perfecte kwaliteit vuurhout. Camping tevreden.',
		location: 'Camping De Bosrand, Putten'
	},
	{
		id: 5,
		customerId: 2,
		date: '2024-01-30',
		time: '15:00',
		type: 'Contractbespreking',
		status: 'gepland',
		duration: 45,
		purpose: 'Seizoenscontract vuurhout 2024 voorbereiden',
		notes: '',
		location: 'Camping De Bosrand, Putten'
	},
	{
		id: 6,
		customerId: 3,
		date: '2024-01-25',
		time: '16:00',
		type: 'Prospect bezoek',
		status: 'gepland',
		duration: 60,
		purpose: 'Proeflevering vuurhout bespreken - restaurant',
		notes: '',
		location: 'Restaurant De Houtstook, Groningen'
	},
	{
		id: 7,
		customerId: 4,
		date: '2024-01-22',
		time: '13:30',
		type: 'Seizoensplanning',
		status: 'voltooid',
		duration: 90,
		purpose: 'Planning vuurhout seizoen 2024-2025',
		notes: 'Geschatte vraag: 40m³ vuurhout. Aanmaakhout ook interessant.',
		location: 'Bosch Tuincentrum, Eindhoven'
	},
	{
		id: 8,
		customerId: 1,
		date: '2023-12-20',
		time: '08:00',
		type: 'Urgente levering',
		status: 'voltooid',
		duration: 20,
		purpose: 'Extra levering vuurhout voor kerstdrukte',
		notes: 'Spoedlevering 5m³ aanmaakhout. Goed ontvangen.',
		location: 'Haverkamp Houthandel, Almere'
	}
]; 