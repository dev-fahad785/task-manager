import { DateTime } from "luxon";

// Common timezone mappings for different countries/regions
const COUNTRY_TIMEZONE_MAP = {
  // Major English-speaking countries
  'US': 'America/New_York',
  'USA': 'America/New_York', 
  'United States': 'America/New_York',
  'UK': 'Europe/London',
  'United Kingdom': 'Europe/London',
  'Canada': 'America/Toronto',
  'Australia': 'Australia/Sydney',
  
  // Major Asian countries
  'India': 'Asia/Kolkata',
  'Pakistan': 'Asia/Karachi',
  'Bangladesh': 'Asia/Dhaka',
  'China': 'Asia/Shanghai',
  'Japan': 'Asia/Tokyo',
  'Singapore': 'Asia/Singapore',
  'Philippines': 'Asia/Manila',
  'Thailand': 'Asia/Bangkok',
  'Malaysia': 'Asia/Kuala_Lumpur',
  'Indonesia': 'Asia/Jakarta',
  
  // Middle East
  'UAE': 'Asia/Dubai',
  'Saudi Arabia': 'Asia/Riyadh',
  'Qatar': 'Asia/Qatar',
  'Kuwait': 'Asia/Kuwait',
  
  // Europe
  'Germany': 'Europe/Berlin',
  'France': 'Europe/Paris',
  'Italy': 'Europe/Rome',
  'Spain': 'Europe/Madrid',
  'Netherlands': 'Europe/Amsterdam',
  'Sweden': 'Europe/Stockholm',
  'Norway': 'Europe/Oslo',
  
  // Africa
  'South Africa': 'Africa/Johannesburg',
  'Egypt': 'Africa/Cairo',
  'Nigeria': 'Africa/Lagos',
  'Kenya': 'Africa/Nairobi',
  
  // South America
  'Brazil': 'America/Sao_Paulo',
  'Argentina': 'America/Argentina/Buenos_Aires',
  'Chile': 'America/Santiago',
  'Mexico': 'America/Mexico_City',
};

// Timezone detection based on WhatsApp country code
const WHATSAPP_COUNTRY_CODE_TIMEZONE = {
  '+1': 'America/New_York',    // US/Canada
  '+44': 'Europe/London',      // UK
  '+91': 'Asia/Kolkata',       // India
  '+92': 'Asia/Karachi',       // Pakistan
  '+880': 'Asia/Dhaka',        // Bangladesh
  '+86': 'Asia/Shanghai',      // China
  '+81': 'Asia/Tokyo',         // Japan
  '+65': 'Asia/Singapore',     // Singapore
  '+63': 'Asia/Manila',        // Philippines
  '+66': 'Asia/Bangkok',       // Thailand
  '+60': 'Asia/Kuala_Lumpur',  // Malaysia
  '+62': 'Asia/Jakarta',       // Indonesia
  '+971': 'Asia/Dubai',        // UAE
  '+966': 'Asia/Riyadh',       // Saudi Arabia
  '+49': 'Europe/Berlin',      // Germany
  '+33': 'Europe/Paris',       // France
  '+39': 'Europe/Rome',        // Italy
  '+34': 'Europe/Madrid',      // Spain
  '+31': 'Europe/Amsterdam',   // Netherlands
  '+46': 'Europe/Stockholm',   // Sweden
  '+47': 'Europe/Oslo',        // Norway
  '+27': 'Africa/Johannesburg', // South Africa
  '+20': 'Africa/Cairo',       // Egypt
  '+234': 'Africa/Lagos',      // Nigeria
  '+254': 'Africa/Nairobi',    // Kenya
  '+55': 'America/Sao_Paulo',  // Brazil
  '+54': 'America/Argentina/Buenos_Aires', // Argentina
  '+56': 'America/Santiago',   // Chile
  '+52': 'America/Mexico_City', // Mexico
  '+61': 'Australia/Sydney',   // Australia
};

/**
 * Detect timezone from WhatsApp phone number
 */
export const detectTimezoneFromPhone = (phoneNumber) => {
  if (!phoneNumber) return 'UTC';
  
  // Clean the phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Try different country code lengths (1-4 digits)
  for (let i = 1; i <= 4; i++) {
    const countryCode = '+' + cleanNumber.substring(0, i);
    if (WHATSAPP_COUNTRY_CODE_TIMEZONE[countryCode]) {
      console.log(`🌍 Detected timezone from ${countryCode}: ${WHATSAPP_COUNTRY_CODE_TIMEZONE[countryCode]}`);
      return WHATSAPP_COUNTRY_CODE_TIMEZONE[countryCode];
    }
  }
  
  console.log(`⚠️ Could not detect timezone from phone: ${phoneNumber}, using UTC`);
  return 'UTC';
};

/**
 * Detect timezone from country name
 */
export const detectTimezoneFromCountry = (country) => {
  if (!country) return 'UTC';
  
  const timezone = COUNTRY_TIMEZONE_MAP[country] || 
                   COUNTRY_TIMEZONE_MAP[country.toLowerCase()] ||
                   COUNTRY_TIMEZONE_MAP[country.toUpperCase()];
                   
  return timezone || 'UTC';
};

/**
 * Convert Wit.ai datetime from Los Angeles timezone to user's timezone
 */
export const convertWitDateToUserTimezone = (witDatetime, userTimezone) => {
  if (!witDatetime || !userTimezone) return witDatetime;
  
  try {
    // Wit.ai returns dates in America/Los_Angeles timezone
    const witDate = DateTime.fromISO(witDatetime, { zone: 'America/Los_Angeles' });
    
    // Convert to user's timezone
    const userDate = witDate.setZone(userTimezone);
    
    console.log(`🔄 Converting datetime:`);
    console.log(`   Original (LA): ${witDate.toISO()}`);
    console.log(`   User timezone: ${userTimezone}`);
    console.log(`   Converted: ${userDate.toISO()}`);
    
    return userDate.toISO();
  } catch (error) {
    console.error('❌ Error converting timezone:', error);
    return witDatetime; // Return original if conversion fails
  }
};

/**
 * Parse relative time phrases in user's timezone
 * Handles: "5pm today", "tomorrow morning", "next monday", etc.
 */
export const parseRelativeTimeInTimezone = (timeText, userTimezone = 'UTC') => {
  try {
    const now = DateTime.now().setZone(userTimezone);
    const lowerText = timeText.toLowerCase();
    
    console.log(`🕐 Parsing "${timeText}" in timezone ${userTimezone}`);
    console.log(`🕐 Current time in ${userTimezone}: ${now.toFormat('MMMM dd, yyyy - h:mm a')}`);
    
    // Extract time if present (like "5pm", "2:30pm", "14:00", "6pm")
    const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    let hour = null, minute = 0;
    
    if (timeMatch) {
      hour = parseInt(timeMatch[1]);
      minute = parseInt(timeMatch[2]) || 0;
      const ampm = timeMatch[3]?.toLowerCase();
      
      // Convert to 24-hour format
      if (ampm === 'pm' && hour !== 12) hour += 12;
      if (ampm === 'am' && hour === 12) hour = 0;
      
      console.log(`🕐 Extracted time: ${hour}:${minute.toString().padStart(2, '0')} (24-hour format)`);
    }
    
    // Determine the base date
    let baseDate = now;
    
    if (lowerText.includes('today')) {
      baseDate = now.startOf('day');
    } else if (lowerText.includes('tomorrow')) {
      baseDate = now.plus({ days: 1 }).startOf('day');
    } else if (lowerText.includes('yesterday')) {
      baseDate = now.minus({ days: 1 }).startOf('day');
    } else if (lowerText.includes('tonight')) {
      baseDate = now.startOf('day');
      // If no specific time mentioned, default to 8 PM for "tonight"
      if (!timeMatch) {
        hour = 20;
        minute = 0;
      }
    } else if (lowerText.includes('morning')) {
      baseDate = lowerText.includes('tomorrow') ? 
        now.plus({ days: 1 }).startOf('day') : 
        now.startOf('day');
      // If no specific time mentioned, default to 9 AM for "morning"
      if (!timeMatch) {
        hour = 9;
        minute = 0;
      }
    } else if (lowerText.includes('afternoon')) {
      baseDate = lowerText.includes('tomorrow') ? 
        now.plus({ days: 1 }).startOf('day') : 
        now.startOf('day');
      // If no specific time mentioned, default to 2 PM for "afternoon"
      if (!timeMatch) {
        hour = 14;
        minute = 0;
      }
    } else if (lowerText.includes('evening')) {
      baseDate = lowerText.includes('tomorrow') ? 
        now.plus({ days: 1 }).startOf('day') : 
        now.startOf('day');
      // If no specific time mentioned, default to 6 PM for "evening"
      if (!timeMatch) {
        hour = 18;
        minute = 0;
      }
    }
    
    // Apply specific time if extracted
    if (hour !== null) {
      baseDate = baseDate.set({ hour, minute, second: 0, millisecond: 0 });
      console.log(`🕐 Final parsed time: ${baseDate.toFormat('MMMM dd, yyyy - h:mm a')} (${userTimezone})`);
    } else {
      // If no specific time found, default to current time
      console.log(`🕐 No specific time found, using current time`);
    }
    
    const result = baseDate.toISO();
    console.log(`🕐 Final ISO result: ${result}`);
    return result;
    
  } catch (error) {
    console.error('❌ Error parsing relative time:', error);
    return DateTime.now().toISO();
  }
};

/**
 * Get user's current time info for context
 */
export const getUserTimeInfo = (timezone) => {
  try {
    const userTime = DateTime.now().setZone(timezone);
    return {
      timezone,
      currentTime: userTime.toISO(),
      localTime: userTime.toFormat('MMMM dd, yyyy - h:mm a'),
      offset: userTime.toFormat('ZZ'),
    };
  } catch (error) {
    console.error('❌ Error getting user time info:', error);
    return {
      timezone: 'UTC',
      currentTime: DateTime.now().toISO(),
      localTime: DateTime.now().toFormat('MMMM dd, yyyy - h:mm a'),
      offset: '+00:00',
    };
  }
};

export default {
  detectTimezoneFromPhone,
  detectTimezoneFromCountry,
  convertWitDateToUserTimezone,
  parseRelativeTimeInTimezone,
  getUserTimeInfo,
};
