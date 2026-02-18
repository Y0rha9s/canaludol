const bcrypt = require('bcryptjs');

const password1 = 'marceloUdol';
const password2 = 'maribelUdol';

const hash1 = bcrypt.hashSync(password1, 10);
const hash2 = bcrypt.hashSync(password2, 10);

console.log('\n===================================');
console.log('COPIAR ESTOS HASHES A SUPABASE:');
console.log('===================================\n');
console.log('Admin 1 Hash:');
console.log(hash1);
console.log('\nAdmin 2 Hash:');
console.log(hash2);
console.log('\n===================================\n');