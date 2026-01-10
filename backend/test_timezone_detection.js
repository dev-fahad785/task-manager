import { detectTimezoneFromPhone } from './utils/timezoneUtils.js';

const testNumbers = [
    { number: '+15550123456', country: 'USA' },
    { number: '+447911123456', country: 'UK' },
    { number: '+919876543210', country: 'India' },
    { number: '+923001234567', country: 'Pakistan' },
    { number: '+61412345678', country: 'Australia' },
    { number: '+819012345678', country: 'Japan' },
    { number: '+971501234567', country: 'UAE' },
    { number: '+8613800138000', country: 'China' },
    { number: '+4915123456789', country: 'Germany' }
];

console.log('--- 🌍 Testing Timezone Detection for Different Countries ---\n');

testNumbers.forEach(({ number, country }) => {
    const timezone = detectTimezoneFromPhone(number);
    console.log(`Country: ${country.padEnd(12)} | Number: ${number.padEnd(16)} | Detected Timezone: ${timezone}`);
});
