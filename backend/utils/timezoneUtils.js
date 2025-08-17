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
    console.log(`   Original (LA): ${witDate.toFormat('MMMM dd, yyyy - h:mm a')} (${witDate.toISO()})`);
    console.log(`   User timezone: ${userTimezone}`);
    console.log(`   Converted: ${userDate.toFormat('MMMM dd, yyyy - h:mm a')} (${userDate.toISO()})`);
    
    return userDate.toISO();
  } catch (error) {
    console.error('❌ Error converting timezone:', error);
    return witDatetime; // Return original if conversion fails
  }
};

/**
 * Parse relative time phrases in user's timezone
 * Handles: "5pm today", "tomorrow morning", "day after tomorrow 8am", "23 aug at 7pm", etc.
 */
export const parseRelativeTimeInTimezone = (timeText, userTimezone = 'UTC') => {
  try {
    const now = DateTime.now().setZone(userTimezone);
    const lowerText = timeText.toLowerCase();
    
    console.log(`🕐 Parsing "${timeText}" in timezone ${userTimezone}`);
    console.log(`🕐 Current time in ${userTimezone}: ${now.toFormat('MMMM dd, yyyy - h:mm a')}`);
    
    // Extract time if present (like "5pm", "2:30pm", "14:00", "6pm", "8am", "7 pm", "11:30 am")
    const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    let hour = null, minute = 0;
    
    if (timeMatch) {
      hour = parseInt(timeMatch[1]);
      minute = parseInt(timeMatch[2]) || 0;
      const ampm = timeMatch[3]?.toLowerCase();
      
      console.log(`🕐 Raw extracted: ${hour}:${minute} ${ampm}`);
      
      // Convert to 24-hour format
      if (ampm === 'pm' && hour !== 12) {
        hour += 12;
      } else if (ampm === 'am' && hour === 12) {
        hour = 0;
      }
      // For AM times (1-11), keep hour as is
      // For PM times, hour is already converted above
      
      console.log(`🕐 Extracted time: ${hour}:${minute.toString().padStart(2, '0')} (24-hour format)`);
    }
    
    // Extract specific date if present (like "23 aug", "august 23", "23/08")
    const monthNames = {
      jan: 1, january: 1,
      feb: 2, february: 2, 
      mar: 3, march: 3,
      apr: 4, april: 4,
      may: 5,
      jun: 6, june: 6,
      jul: 7, july: 7,
      aug: 8, august: 8,
      sep: 9, september: 9,
      oct: 10, october: 10,
      nov: 11, november: 11,
      dec: 12, december: 12
    };
    
    // Try different date patterns
    let specificDay = null, specificMonth = null, specificYear = now.year;
    
    // Pattern: "23 aug", "23 august", "23-aug", "19-aug"
    const dateMatch1 = lowerText.match(/(\d{1,2})[-\s]+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)/);
    if (dateMatch1) {
      specificDay = parseInt(dateMatch1[1]);
      specificMonth = monthNames[dateMatch1[2]];
      console.log(`🗓️ Found specific date: Day ${specificDay}, Month ${specificMonth} (pattern 1)`);
    }
    
    // Pattern: "august 23", "aug 23", "aug-23"
    const dateMatch2 = lowerText.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[-\s]+(\d{1,2})/);
    if (!dateMatch1 && dateMatch2) {
      specificMonth = monthNames[dateMatch2[1]];
      specificDay = parseInt(dateMatch2[2]);
      console.log(`🗓️ Found specific date: Month ${specificMonth}, Day ${specificDay} (pattern 2)`);
    }
    
    // Pattern: "on 19-aug 2025", "19-aug-2025"
    const dateMatch3 = lowerText.match(/(\d{1,2})[-\s]+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[-\s]+(\d{4})/);
    if (dateMatch3) {
      specificDay = parseInt(dateMatch3[1]);
      specificMonth = monthNames[dateMatch3[2]];
      specificYear = parseInt(dateMatch3[3]);
      console.log(`🗓️ Found specific date with year: Day ${specificDay}, Month ${specificMonth}, Year ${specificYear} (pattern 3)`);
    }
    
    // Determine the base date
    let baseDate = now;
    
    if (specificDay && specificMonth) {
      // Use specific date
      baseDate = DateTime.fromObject({
        year: specificYear,
        month: specificMonth,
        day: specificDay,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      }, { zone: userTimezone });
      
      // If the date is in the past, assume next year
      if (baseDate < now.startOf('day')) {
        baseDate = baseDate.plus({ years: 1 });
        specificYear = baseDate.year;
      }
      
      console.log(`🗓️ Using specific date: ${baseDate.toFormat('MMMM dd, yyyy')} (${userTimezone})`);
    } else if (lowerText.includes('day after tomorrow')) {
      baseDate = now.plus({ days: 2 }).startOf('day');
      console.log(`🕐 Base date: Day after tomorrow (${baseDate.toFormat('MMMM dd, yyyy')})`);
    } else if (lowerText.includes('today')) {
      baseDate = now.startOf('day');
      console.log(`🕐 Base date: Today (${baseDate.toFormat('MMMM dd, yyyy')})`);
    } else if (lowerText.includes('tomorrow')) {
      baseDate = now.plus({ days: 1 }).startOf('day');
      console.log(`🕐 Base date: Tomorrow (${baseDate.toFormat('MMMM dd, yyyy')})`);
    } else if (lowerText.includes('yesterday')) {
      baseDate = now.minus({ days: 1 }).startOf('day');
      console.log(`🕐 Base date: Yesterday (${baseDate.toFormat('MMMM dd, yyyy')})`);
    } else if (lowerText.includes('tonight')) {
      baseDate = now.startOf('day');
      // If no specific time mentioned, default to 8 PM for "tonight"
      if (!timeMatch) {
        hour = 20;
        minute = 0;
      }
      console.log(`🕐 Base date: Tonight (${baseDate.toFormat('MMMM dd, yyyy')})`);
    } else if (lowerText.includes('morning')) {
      baseDate = lowerText.includes('tomorrow') ? 
        now.plus({ days: 1 }).startOf('day') : 
        now.startOf('day');
      // If no specific time mentioned, default to 9 AM for "morning"
      if (!timeMatch) {
        hour = 9;
        minute = 0;
      }
      console.log(`🕐 Base date: Morning (${baseDate.toFormat('MMMM dd, yyyy')})`);
    } else if (lowerText.includes('afternoon')) {
      baseDate = lowerText.includes('tomorrow') ? 
        now.plus({ days: 1 }).startOf('day') : 
        now.startOf('day');
      // If no specific time mentioned, default to 2 PM for "afternoon"
      if (!timeMatch) {
        hour = 14;
        minute = 0;
      }
      console.log(`🕐 Base date: Afternoon (${baseDate.toFormat('MMMM dd, yyyy')})`);
    } else if (lowerText.includes('evening')) {
      baseDate = lowerText.includes('tomorrow') ? 
        now.plus({ days: 1 }).startOf('day') : 
        now.startOf('day');
      // If no specific time mentioned, default to 6 PM for "evening"
      if (!timeMatch) {
        hour = 18;
        minute = 0;
      }
      console.log(`🕐 Base date: Evening (${baseDate.toFormat('MMMM dd, yyyy')})`);
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
