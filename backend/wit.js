import axios from "axios";
import { DateTime } from "luxon";

const WIT_TOKEN = "Bearer 72HIVMNTYWLQBNYTKOULYUBXDKTGUIOX";

export const runWitTest = async (message, timezone = 'UTC') => {
  try {
    const context = JSON.stringify({ timezone });
    const url = `https://api.wit.ai/message?v=20230804&q=${encodeURIComponent(message)}&context=${encodeURIComponent(context)}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: WIT_TOKEN,
        "Content-Type": "application/json",
      },
    });
    
    // console.log("🤖 Wit AI Response:", response.data);
    const { intents, entities } = response.data;

    const intent = intents?.[0]?.name || "No intent detected";

    let datetime = null;
    let datetimeFormatted = "No datetime";
    let dateOnly = null;
    let timeOnly = null;

    const datetimeEntity = entities["wit$datetime:datetime"]?.[0];
    
    if (datetimeEntity) {
      let isoDate = null;
      
      // console.log("📅 DateTime entity:", datetimeEntity);
      
      if (datetimeEntity.type === "value") {
        isoDate = datetimeEntity.value;
        console.log("📅 Single value:", isoDate);
      } else if (datetimeEntity.type === "interval") {
        isoDate = datetimeEntity.from?.value || datetimeEntity.to?.value;
        console.log("📅 Interval - Using:", isoDate);
      }

      if (isoDate) {
        const dt = DateTime.fromISO(isoDate, { setZone: true });
        
        // ✅ Clean formats
        datetime = dt.toISO(); // Keeps timezone info
        datetimeFormatted = dt.toFormat("MMMM dd, yyyy 'at' h:mm a"); // "August 19, 2025 at 10:00 AM"
        dateOnly = dt.toFormat("yyyy-MM-dd"); // "2025-08-19"
        timeOnly = dt.toFormat("HH:mm");      // "10:00"
      }
    }

    const priority = entities["priority:priority"]?.[0]?.value || "Medium";
    //convert datetime to a valid js date object
    const finalDateTime = datetime ? new Date(datetime) : null;
    const result = { 
      text: message, 
      intent, 
      datetime,
      finalDateTime,
      datetimeFormatted,
      date: dateOnly,
      time: timeOnly,
      priority 
    };
    
    // console.log("🎯 Final Wit result:", result);
    return result;
    
  } catch (error) {
    console.error("❌ Wit.ai Error:", error.response?.data || error.message);
    return { text: message, intent: "Error", datetime: null, priority:"medium" };
  }
};

const result=await runWitTest('Schedule a meeting with the team today at 10 pm urgent'); 
console.log(result)