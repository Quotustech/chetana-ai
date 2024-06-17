const dateFormatter = (dateString: Date)=>{

    // Create a Date object from the timestamp string
    const date = new Date(dateString);
    
    // Extract individual components from the Date object
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 because January is 0
    const day = ("0" + date.getDate()).slice(-2);
    let hours = date.getHours();
    const period = hours >= 12 ? "PM" : "AM";
    
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours || 12; // If hours is 0, convert it to 12
    
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    
    // Format the date and time as desired
    const formattedDateTime = year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds + " " + period;
    
return formattedDateTime;
}

export default dateFormatter;


