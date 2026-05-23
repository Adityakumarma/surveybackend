const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: String,
  gender: String,
  age: Number,
  dateOfBirth: String,
  phoneNumber: String,
  passportNumber: String,
  relationship: String,
  maritalStatus: String,
  education: {
    level: String,
    institutionName: String,
    course: String,
    
  },
  occupation: {
    employmentType: String,
    monthlySalary: Number,
    workplace: String,
    retiredFromJob: Boolean,
    retiredFrom: [String]
  },
  monthlyIncome: Number,
  aadhaarNumber: String,
  voterId: String,
  bloodGroup: String,
  insurance: String,
  healthDetails: {
    bloodPressure: Boolean,
    diabetes: Boolean,
    cancer: Boolean,
    heartDisease: Boolean,
    kidneyDisease: Boolean,
    stroke: Boolean,
    mentalHealthIssues: Boolean,
    chronicDisease: String,
    disabilityType: String
  },
});

const welfareSchema = new mongoose.Schema({
  pension: Boolean,
  widowPension: Boolean,
  disabilityPension: Boolean,
  oldAgePension: Boolean,
  scholarship: Boolean,
  housingScheme: Boolean
});

const vehicleSchema = new mongoose.Schema({
  cycle: Boolean,
  bike: Boolean,
  car: Boolean,
  jeep: Boolean,
  auto: Boolean,
  miniVan: Boolean,
  taxi: Boolean,
  bus: Boolean,
  goodsVehicle: Boolean
});

const housingSchema = new mongoose.Schema({
  houseOwnership: String,
  houseType: String,
  toiletAvailability: Boolean,
  waterConnection: Boolean,
  electricity: Boolean,
  internetAccess: Boolean,
  wasteManagement: Boolean,
  solarSystem: Boolean,
  gasConnection: Boolean
});

const familySchema = new mongoose.Schema({
  surveyNumber: String,
  wardNumber: String,
  houseNumber: String,
  houseName: String,
  address: String,
  phoneNumber: String,
  religion: String,
  caste: String,
  casteCategory: String,
  familyHeadName: String,
  rationCardType: String,
  rationCardNumber: String,
  pincode: String,
  members: [memberSchema],
  welfareSchemes: welfareSchema,
  housingDetails: housingSchema,
  vehicleDetails: vehicleSchema,
  petsDetails: {
    petsAvailable: { type: Boolean, default: false },
    hen: { type: Boolean, default: false },
    goat: { type: Boolean, default: false },
    cow: { type: Boolean, default: false },
    fish: { type: Boolean, default: false },
    birds: { type: Boolean, default: false },
    shelterAvailable: { type: Boolean, default: false },
    loanAvailed: { type: Boolean, default: false }
  },
}, 
{ timestamps: true });

module.exports = mongoose.model('Family', familySchema);
