const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const ISRO_BASE_URL = 'https://www.isro.gov.in/ISRO_EN/';

async function scrapePressReleases() {
  try {
    // Fetch the HTML content from ISRO website
    const response = await axios.get('https://www.isro.gov.in/Press.html');
    const html = response.data;
    
    // Parse HTML and extract press releases
    const pressReleaseData = await parseISROPressReleases(html);
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // Save the data to a JSON file
    const filePath = path.join(dataDir, 'press-releases.json');
    fs.writeFileSync(filePath, JSON.stringify(pressReleaseData, null, 2));
    
    console.log('Press releases scraped and saved successfully!');
  } catch (err) {
    console.error('Error scraping press releases:', err);
    process.exit(1);
  }
}

async function parseISROPressReleases(html) {
  const pressReleasesByYear = {};
  const $ = cheerio.load(html);
  
  // Find all years
  const years = [];
  $('h2, h3, h4, strong').each(function() {
    const text = $(this).text().trim();
    if (/^20\d{2}$/.test(text)) {
      years.push(text);
    }
  });
  
  // For each year, find the corresponding press release table
  for (const year of years) {
    const releases = [];
    
    // Find the table for this year
    let yearElement = $(`h2:contains(${year}), h3:contains(${year}), h4:contains(${year}), strong:contains(${year})`).first();
    let tableElement = yearElement.nextAll('table').first();
    
    // If no direct table found, try alternative approaches
    if (tableElement.length === 0) {
      const section = $(`div:contains(${year}), section:contains(${year})`).first();
      tableElement = section.find('table').first();
    }
    
    // If still no table found, use general approach
    if (tableElement.length === 0) {
      $('table').each(function() {
        const tableText = $(this).text();
        if (tableText.includes(year)) {
          tableElement = $(this);
          return false;
        }
      });
    }
    
    // Process the table rows
    if (tableElement.length > 0) {
      const rows = tableElement.find('tr');
      
      for (let i = 1; i < rows.length; i++) {
        const cells = $(rows[i]).find('td, th');
        
        if (cells.length >= 3) {
          const sn = parseInt($(cells[0]).text().trim(), 10) || i;
          const titleCell = $(cells[1]);
          const title = titleCell.text().trim();
          const date = $(cells[2]).text().trim();
          
          if (title && date) {
            // Find the link to the press release
            const link = titleCell.find('.pageContent a, a').first().attr('href');
            let url = null;
            let content = null;
            
            if (link) {
              // Construct the full URL
              url = link.startsWith('http') ? link : `${ISRO_BASE_URL}${link}`;
              
              try {
                // Fetch the press release content
                const pressResponse = await axios.get(url);
                const pressHtml = pressResponse.data;
                const press$ = cheerio.load(pressHtml);
                
                // Extract the content (adjust selector based on ISRO's HTML structure)
                content = press$('.content, article, .press-release, .news-content, .pageContent')
                  .first()
                  .text()
                  .trim();
              } catch (err) {
                console.warn(`Failed to fetch content for ${url}:`, err.message);
              }
            }
            
            releases.push({
              SN: sn,
              Title: title,
              Date: date,
              URL: url,
              Content: content
            });
          }
        }
      }
    }
    
    if (releases.length > 0) {
      pressReleasesByYear[year] = releases;
    }
  }
  
  // Fallback: If the above parsing fails, use a more general approach
  if (Object.keys(pressReleasesByYear).length === 0) {
    const tables = $('table');
    
    for (let i = 0; i < tables.length; i++) {
      const table = $(tables[i]);
      const rows = table.find('tr');
      
      for (let j = 1; j < rows.length; j++) {
        const cells = $(rows[j]).find('td, th');
        
        if (cells.length >= 3) {
          const sn = parseInt($(cells[0]).text().trim(), 10) || j;
          const titleCell = $(cells[1]);
          const title = titleCell.text().trim();
          const date = $(cells[2]).text().trim();
          
          const yearMatch = date.match(/\b(20\d{2})\b/);
          
          if (yearMatch && title && date) {
            const year = yearMatch[1];
            
            // Find the link to the press release
            const link = titleCell.find('.pageContent a, a').first().attr('href');
            let url = null;
            let content = null;
            
            if (link) {
              // Construct the full URL
              url = link.startsWith('http') ? link : `${ISRO_BASE_URL}${link}`;
              
              try {
                // Fetch the press release content
                const pressResponse = await axios.get(url);
                const pressHtml = pressResponse.data;
                const press$ = cheerio.load(pressHtml);
                
                // Extract the content (adjust selector based on ISRO's HTML structure)
                content = press$('.content, article, .press-release, .news-content, .pageContent')
                  .first()
                  .text()
                  .trim();
              } catch (err) {
                console.warn(`Failed to fetch content for ${url}:`, err.message);
              }
            }
            
            if (!pressReleasesByYear[year]) {
              pressReleasesByYear[year] = [];
            }
            
            pressReleasesByYear[year].push({
              SN: sn,
              Title: title,
              Date: date,
              URL: url,
              Content: content
            });
          }
        }
      }
    }
  }
  
  return pressReleasesByYear;
}

// Run the scraper
scrapePressReleases(); 