// Quick script to add gender data to existing people
// Run this in browser console on the Manage page

export const genderData = {
  // Generation 0
  39: 'male',   // Vernus
  40: 'female', // Maisie (Forpine)
  
  // Generation 1
  11: 'male',   // Steffan
  12: 'female', // Cáir (Salomon)
  41: 'male',   // Wenton
  42: 'male',   // Bronnis
  43: 'female', // Penny
  44: 'female', // Livia
  45: 'male',   // Thoroness
  46: 'female', // Visla (Paynter)
  47: 'female', // Ilaria (Silver)
  49: 'male',   // Wenton II
  20: 'female', // Grennett (Carlyle)
  21: 'male',   // Sylar Hendry
  18: 'male',   // Lochlann Wilfson
  36: 'female', // Gema Lots
  
  // Generation 2
  13: 'male',   // Steffan II
  14: 'male',   // Mychal
  15: 'male',   // Salomon
  16: 'female', // Serenne
  17: 'female', // Isabela
  22: 'female', // Zoia (Hendry)
  35: 'female', // Sarai (Wentburn)
  19: 'female', // Ioanna (Vespen)
  37: 'male',   // Ralf Wilfson
  38: 'male',   // Tamason Wilfson
  
  // Generation 3
  23: 'male',   // Marcus
  24: 'male',   // Vernot
  25: 'female', // Signa
  26: 'female', // Marta
  27: 'male',   // Ronnin
  28: 'male',   // Bennett
  29: 'male',   // Steffen III Wilford
  30: 'male',   // Ronnet Wilford
  31: 'female', // Charnett Wilford
  32: 'female', // Maisie
  33: 'female', // Càir
  34: 'female', // Livia
};

// Function to update all people with gender
export async function addGenderToDatabase() {
  const { getAllPeople, updatePerson } = await import('../services/database');
  
  const people = await getAllPeople();
  let updated = 0;
  
  for (const person of people) {
    if (genderData[person.id]) {
      await updatePerson(person.id, {
        ...person,
        gender: genderData[person.id]
      });
      updated++;
      console.log(`Updated ${person.firstName} ${person.lastName} -> ${genderData[person.id]}`);
    }
  }
  
  console.log(`✅ Updated ${updated} people with gender data!`);
  alert(`Successfully added gender data to ${updated} people! Please refresh the page.`);
}

// To run: Call addGenderToDatabase() from browser console
