const { test, expect } = require('@playwright/test');

test('Healthcare Platform Complete API Flow', async ({ request }) => {
  let bearerToken;
  let providerId;
  let patientId;
  
  console.log('🔐 Starting Login Process...');
  
  // Step 1: Login and extract bearer token
  const loginResponse = await request.post('https://stage-api.ecarehealth.com/api/master/login', {
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      "username": "RubyVOlague@jourrapide.com",
      "password": "Pass@123"
    }
  });
  
  console.log('Login Response Status:', loginResponse.status());
  expect(loginResponse.status()).toBe(200);
  
  const loginData = await loginResponse.json();
  console.log('Login Response:', JSON.stringify(loginData, null, 2));
  
  bearerToken = loginData.access_token;
  console.log('Extracted Bearer Token:', bearerToken);
  
  // Headers for all future requests
  const authHeaders = {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json'
  };
  
  console.log('\n🧍‍♂️ Creating Provider...');
  
  // Step 2: Create Provider
  const createProviderResponse = await request.post('https://stage-api.ecarehealth.com/api/master/provider', {
    headers: authHeaders,
    data: {
      "roleType": "PROVIDER",
      "active": false,
      "admin_access": true,
      "status": false,
      "avatar": "",
      "role": "PROVIDER",
      "firstName": "Dr",
      "lastName": "Aniket",
      "gender": "MALE",
      "phone": "",
      "npi": "",
      "specialities": null,
      "groupNpiNumber": "",
      "licensedStates": null,
      "licenseNumber": "",
      "acceptedInsurances": null,
      "experience": "",
      "taxonomyNumber": "",
      "workLocations": null,
      "email": "draniket123@medarch.com",
      "officeFaxNumber": "",
      "areaFocus": "",
      "hospitalAffiliation": "",
      "ageGroupSeen": null,
      "spokenLanguages": null,
      "providerEmployment": "",
      "insurance_verification": "",
      "prior_authorization": "",
      "secondOpinion": "",
      "careService": null,
      "bio": "",
      "expertise": "",
      "workExperience": "",
      "licenceInformation": [
        {
          "uuid": "",
          "licenseState": "",
          "licenseNumber": ""
        }
      ],
      "deaInformation": [
        {
          "deaState": "",
          "deaNumber": "",
          "deaTermDate": "",
          "deaActiveDate": ""
        }
      ]
    }
  });
  
  console.log('Create Provider Response Status:', createProviderResponse.status());
  expect(createProviderResponse.status()).toBe(200);
  
  const createProviderData = await createProviderResponse.json();
  console.log('Create Provider Response:', JSON.stringify(createProviderData, null, 2));
  
  console.log('\n🔍 Getting Provider List...');
  
  // Step 3: Get Provider and extract UUID
  const getProviderResponse = await request.get('https://stage-api.ecarehealth.com/api/master/provider?page=0&size=20', {
    headers: authHeaders
  });
  
  console.log('Get Provider Response Status:', getProviderResponse.status());
  expect(getProviderResponse.status()).toBe(200);
  
  const getProviderData = await getProviderResponse.json();
  console.log('Get Provider Response:', JSON.stringify(getProviderData, null, 2));
  
  // Find the created provider
  const createdProvider = getProviderData.content?.find(provider => 
    provider.firstName === "Dr" && 
    provider.lastName === "Aniket" && 
    provider.email === "draniket123@medarch.com"
  );
  
  if (!createdProvider) {
    throw new Error('Created provider not found in the list');
  }
  
  providerId = createdProvider.uuid;
  console.log('Extracted Provider ID:', providerId);
  
  console.log('\n⏰ Setting Provider Availability...');
  
  // Step 4: Set Availability for Provider
  const availabilityResponse = await request.post('https://stage-api.ecarehealth.com/api/master/provider/availability-setting', {
    headers: authHeaders,
    data: {
      "setToWeekdays": false,
      "providerId": providerId,
      "bookingWindow": "3",
      "timezone": "EST",
      "bufferTime": 0,
      "initialConsultTime": 0,
      "followupConsultTime": 0,
      "settings": [
        {
          "type": "NEW",
          "slotTime": "30",
          "minNoticeUnit": "8_HOUR"
        }
      ],
      "blockDays": [],
      "daySlots": [
        {
          "day": "Friday",
          "startTime": "12:00:00",
          "endTime": "13:00:00",
          "availabilityMode": "VIRTUAL"
        }
      ],
      "bookBefore": "undefined undefined",
      "xTENANTID": "stage_aithinkitive"
    }
  });
  
  console.log('Set Availability Response Status:', availabilityResponse.status());
  expect(availabilityResponse.status()).toBe(200);
  
  const availabilityData = await availabilityResponse.json();
  console.log('Set Availability Response:', JSON.stringify(availabilityData, null, 2));
  
  console.log('\n👤 Creating Patient...');
  
  // Step 5: Create Patient
  const createPatientResponse = await request.post('https://stage-api.ecarehealth.com/api/master/patient', {
    headers: authHeaders,
    data: {
      "phoneNotAvailable": true,
      "emailNotAvailable": true,
      "registrationDate": "",
      "firstName": "Aniket",
      "middleName": "",
      "lastName": "Patient",
      "timezone": "IST",
      "birthDate": "2002-02-19T18:30:00.000Z",
      "gender": "MALE",
      "ssn": "",
      "mrn": "",
      "languages": null,
      "avatar": "",
      "mobileNumber": "",
      "faxNumber": "",
      "homePhone": "",
      "address": {
        "line1": "",
        "line2": "",
        "city": "",
        "state": "",
        "country": "",
        "zipcode": ""
      },
      "emergencyContacts": [
        {
          "firstName": "",
          "lastName": "",
          "mobile": ""
        }
      ],
      "patientInsurances": [
        {
          "active": true,
          "insuranceId": "",
          "copayType": "FIXED",
          "coInsurance": "",
          "claimNumber": "",
          "note": "",
          "deductibleAmount": "",
          "employerName": "",
          "employerAddress": {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "country": "",
            "zipcode": ""
          },
          "subscriberFirstName": "",
          "subscriberLastName": "",
          "subscriberMiddleName": "",
          "subscriberSsn": "",
          "subscriberMobileNumber": "",
          "subscriberAddress": {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "country": "",
            "zipcode": ""
          },
          "groupId": "",
          "memberId": "",
          "groupName": "",
          "frontPhoto": "",
          "backPhoto": "",
          "insuredFirstName": "",
          "insuredLastName": "",
          "address": {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "country": "",
            "zipcode": ""
          },
          "insuredBirthDate": "",
          "coPay": "",
          "insurancePayer": {}
        }
      ],
      "emailConsent": false,
      "messageConsent": false,
      "callConsent": false,
      "patientConsentEntities": [
        {
          "signedDate": "2025-07-24T08:07:34.316Z"
        }
      ]
    }
  });
  
  console.log('Create Patient Response Status:', createPatientResponse.status());
  expect(createPatientResponse.status()).toBe(200);
  
  const createPatientData = await createPatientResponse.json();
  console.log('Create Patient Response:', JSON.stringify(createPatientData, null, 2));
  
  console.log('\n🔍 Getting Patient List...');
  
  // Step 6: Get Patient and extract UUID
  const getPatientResponse = await request.get('https://stage-api.ecarehealth.com/api/master/patient?page=0&size=20&searchString=', {
    headers: authHeaders
  });
  
  console.log('Get Patient Response Status:', getPatientResponse.status());
  expect(getPatientResponse.status()).toBe(200);
  
  const getPatientData = await getPatientResponse.json();
  console.log('Get Patient Response:', JSON.stringify(getPatientData, null, 2));
  
  // Find the created patient
  const createdPatient = getPatientData.content?.find(patient => 
    patient.firstName.toLowerCase() === "aniket" && 
    patient.lastName === "Patient"
  );
  
  if (!createdPatient) {
    throw new Error('Created patient not found in the list');
  }
  
  patientId = createdPatient.uuid;
  console.log('Extracted Patient ID:', patientId);
  
  console.log('\n📅 Booking Appointment...');
  
  // Step 7: Book Appointment (Note: The endpoint in the document appears to be incorrect, should be appointment endpoint)
  const bookAppointmentResponse = await request.post('https://stage-api.ecarehealth.com/api/master/appointment', {
    headers: authHeaders,
    data: {
      "mode": "VIRTUAL",
      "patientId": patientId,
      "customForms": null,
      "visit_type": "",
      "type": "NEW",
      "paymentType": "CASH",
      "providerId": providerId,
      "startTime": "2025-08-27T17:00:00Z",
      "endTime": "2025-08-27T17:30:00Z", // Fixed: corrected the end time date
      "insurance_type": "",
      "note": "",
      "authorization": "",
      "forms": [],
      "chiefComplaint": "appointment test",
      "isRecurring": false,
      "recurringFrequency": "daily",
      "reminder_set": false,
      "endType": "never",
      "endDate": "2025-07-24T08:07:34.318Z",
      "endAfter": 5,
      "customFrequency": 1,
      "customFrequencyUnit": "days",
      "selectedWeekdays": [],
      "reminder_before_number": 1,
      "timezone": "CST",
      "duration": 30,
      "xTENANTID": "stage_aithinkitive"
    }
  });
  
  console.log('Book Appointment Response Status:', bookAppointmentResponse.status());
  expect(bookAppointmentResponse.status()).toBe(200);
  
  const bookAppointmentData = await bookAppointmentResponse.json();
  console.log('Book Appointment Response:', JSON.stringify(bookAppointmentData, null, 2));
  
  console.log('\n✅ Test Flow Completed Successfully!');
  console.log('Summary:');
  console.log('- Bearer Token:', bearerToken);
  console.log('- Provider ID:', providerId);
  console.log('- Patient ID:', patientId);
});