# Scraper

To run the application [Docker](https://www.docker.com/get-started/) and [Docker compose](https://docs.docker.com/compose/install/) are required.

# Starting the application
Start the mongodb with docker compose:
```docker-compose up --build -d mongodb```

Install the node modules of the app by running:
```npm install```

Build the app by running:
```npm run build```

Start the app:
```npm start```

The API should be available on:
```http://localhost:3000/```

# Running the application in dev mode

Run the scraper in development mode by running:
```npm run dev```

# Scraping the data

To scrape the data by running it as a background job run:
```curl -X POST http://localhost:3000/scraper/job -H "Content-Type: application/json" -d '{"email": "ravi.van.test@gmail.com", "password": "ravi.van.test@gmail.com"}'```

Scraping is also available as non job with the response waiting for the scraping to finish by running:
```curl -X POST http://localhost:3000/scraper -H "Content-Type: application/json" -d '{"email": "ravi.van.test@gmail.com", "password": "ravi.van.test@gmail.com"}'```

# Checking the scraped profile results
To check the scraped data run:
```curl -X GET "http://localhost:3000/profile?email=ravi.van.test@gmail.com"```

# Downloading the scraped PDF

To download the scraped PDF run:
```curl -X GET "http://localhost:3000/pdf?email=ravi.van.test@gmail.com" --output scrapedProfile.pdf```

