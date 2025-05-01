// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const app = express();

// app.use(cors());

// app.get('/isro-press', async (req, res) => {
//   try {
//     const response = await axios.get('https://www.isro.gov.in/Press.html');
//     res.send(response.data);
//   } catch (err) {
//     res.status(500).send('Failed to fetch ISRO press releases.');
//   }
// });

// app.listen(3000, () => console.log('Proxy running on http://localhost:3000'));



const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.use(cors());

// Route to fetch and transform ISRO press releases as JSON
app.get('/isro-press', async (req, res) => {
  try {
    // Fetch the HTML content from ISRO website
    const response = await axios.get('https://www.isro.gov.in/Press.html');
    const html = response.data;
    
    // Parse HTML and extract press releases
    const pressReleaseData = parseISROPressReleases(html);
    
    // Send the data as JSON
    res.json(pressReleaseData);
  } catch (err) {
    console.error('Error fetching or processing ISRO data:', err);
    res.status(500).json({ error: 'Failed to fetch and process ISRO press releases.' });
  }
});

/**
 * Parse ISRO website HTML and extract press releases organized by year
 * @param {string} html - The HTML content from ISRO website
 * @returns {Object} - Press releases organized by year
 */
function parseISROPressReleases(html) {
  // Initialize the result object to store releases by year
  const pressReleasesByYear = {};
  
  // Load HTML content into cheerio
  const $ = cheerio.load(html);
  
  // Find all year sections
  // Note: This selector might need adjustment based on the actual HTML structure
  // of the ISRO website. The following is a general approach that may need tweaking.
  
  // Find all years (assuming they are in h2 or similar elements)
  const years = [];
  $('h2, h3, h4, strong').each(function() {
    const text = $(this).text().trim();
    if (/^20\d{2}$/.test(text)) {
      years.push(text);
    }
  });
  
  // For each year, find the corresponding press release table
  years.forEach(year => {
    const releases = [];
    
    // Find the table for this year
    // This is a simplification - you might need to adjust based on actual HTML structure
    let yearElement = $(`h2:contains(${year}), h3:contains(${year}), h4:contains(${year}), strong:contains(${year})`).first();
    let tableElement = yearElement.nextAll('table').first();
    
    // If no direct table found, try alternative approaches
    if (tableElement.length === 0) {
      // Try to find a div or section containing both the year and the table
      const section = $(`div:contains(${year}), section:contains(${year})`).first();
      tableElement = section.find('table').first();
    }
    
    // If still no table found, use general approach to find tables with dates matching the year
    if (tableElement.length === 0) {
      $('table').each(function() {
        const tableText = $(this).text();
        if (tableText.includes(year)) {
          tableElement = $(this);
          return false; // Break the loop
        }
      });
    }
    
    // Process the table rows
    if (tableElement.length > 0) {
      tableElement.find('tr').each(function(index) {
        // Skip header row
        if (index > 0) {
          const cells = $(this).find('td, th');
          
          if (cells.length >= 3) {
            const sn = parseInt($(cells[0]).text().trim(), 10) || index;
            const title = $(cells[1]).text().trim();
            const date = $(cells[2]).text().trim();
            
            // Only add if we have actual content
            if (title && date) {
              releases.push({
                SN: sn,
                Title: title,
                Date: date
              });
            }
          }
        }
      });
    }
    
    // Add releases to the year if any were found
    if (releases.length > 0) {
      pressReleasesByYear[year] = releases;
    }
  });
  
  // Fallback: If the above parsing fails, use a more general approach
  if (Object.keys(pressReleasesByYear).length === 0) {
    // Look for tables with dates, then group by year
    $('table').each(function() {
      const table = $(this);
      
      // Process all rows
      table.find('tr').each(function(index) {
        // Skip header row
        if (index > 0) {
          const cells = $(this).find('td, th');
          
          if (cells.length >= 3) {
            const sn = parseInt($(cells[0]).text().trim(), 10) || index;
            const title = $(cells[1]).text().trim();
            const date = $(cells[2]).text().trim();
            
            // Extract year from date (assuming format like "April 28, 2025" or "Apr, 12, 2018")
            const yearMatch = date.match(/\b(20\d{2})\b/);
            
            if (yearMatch && title && date) {
              const year = yearMatch[1];
              
              // Initialize year array if needed
              if (!pressReleasesByYear[year]) {
                pressReleasesByYear[year] = [];
              }
              
              // Add the release
              pressReleasesByYear[year].push({
                SN: sn,
                Title: title,
                Date: date
              });
            }
          }
        }
      });
    });
  }
  
  return pressReleasesByYear;
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ISRO Press Release API server running on http://localhost:${PORT}`);
  console.log(`Access the JSON data at http://localhost:${PORT}/isro-press`);
});