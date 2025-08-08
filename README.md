<<<<<<< HEAD
# qa-ai-suit-23
=======
# Provider UI Tests

This project contains automated UI tests for the eCare Health provider portal using Playwright.

## Issues Fixed

1. **URL Mismatch**: Fixed the hardcoded URL in the test file to use the baseURL from Playwright config
2. **Package.json Scripts**: Added proper Playwright test scripts
3. **Code Duplication**: Moved helper functions to utils/helpers.js and test data to utils/test-data.js
4. **Error Handling**: Added better error handling, logging, and timeouts
5. **Test Structure**: Improved test organization and reliability

## Project Structure

```
provider-ui-tests/
├── tests/
│   ├── provider-workflow.spec.js    # Main E2E workflow test
│   └── smoke-test.spec.js           # Basic smoke test
├── utils/
│   ├── helpers.js                   # Helper functions
│   └── test-data.js                 # Test data constants
├── playwright.config.js             # Playwright configuration
└── package.json                     # Project dependencies
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Files
```bash
npx playwright test tests/smoke-test.spec.js
npx playwright test tests/provider-workflow.spec.js
```

### Headed Mode (with browser visible)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### UI Mode (Playwright Test UI)
```bash
npm run test:ui
```

### View Test Report
```bash
npm run report
```

## Test Configuration

- **Base URL**: `https://stage_aithinkitive.uat.provider.ecarehealth.com`
- **Timeout**: 60 seconds (120 seconds for complex workflow test)
- **Headless**: false (set to true for CI/CD)
- **Screenshots**: Only on failure
- **Videos**: Retain on failure
- **Trace**: On first retry

## Test Workflow

The main test (`provider-workflow.spec.js`) performs the following steps:

1. **Login**: Authenticates with test credentials
2. **Add Provider**: Creates a new provider user
3. **Create Patient**: Creates a new patient record
4. **Set Availability**: Configures provider availability for telehealth
5. **Book Appointment**: Schedules a virtual appointment

## Helper Functions

- `getRandomItem(array)`: Returns a random item from an array
- `generateRandomDOB()`: Generates a random date of birth between 1960-2005

## Test Data

- Predefined lists of Indian first names and last names
- Uses Faker.js for generating additional test data

## Troubleshooting

If tests fail:

1. Check if the base URL is accessible
2. Verify test credentials are valid
3. Check network connectivity
4. Run in headed mode to see what's happening: `npm run test:headed`
5. Use debug mode for step-by-step execution: `npm run test:debug`

## Notes

- The test uses real test credentials and should only be run against test environments
- Some selectors may need adjustment if the UI changes
- The test includes appropriate waits and timeouts for better reliability 
>>>>>>> shubhambranch
