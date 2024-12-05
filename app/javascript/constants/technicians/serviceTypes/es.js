import serviceTypes from "constants/services/serviceTypes/es"

const defaultServiceTypes = [
  "installation",
  "maintenance",
  "repair",
  "homeProgram",
  "deliveries"
]

const diagnosisType  = {
  key: "Diagnóstico en Taller",
  label: "Diagnóstico en Taller"
}

const selectedServiceTypes = defaultServiceTypes.map(serviceTypeKey => serviceTypes[serviceTypeKey])


export default [...selectedServiceTypes, diagnosisType]
