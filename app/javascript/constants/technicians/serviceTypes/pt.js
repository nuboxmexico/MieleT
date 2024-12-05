import serviceTypes from "constants/services/serviceTypes/pt"

const defaultServiceTypes = [
  "installation",
  "maintenance",
  "repair",
  "homeProgram",
  "deliveries"
]

const diagnosisType  = {
  key: "Diagnóstico en Taller",
  label: "Diagnóstico em Oficina"
}

const selectedServiceTypes = defaultServiceTypes.map(serviceTypeKey => serviceTypes[serviceTypeKey])

export default [...selectedServiceTypes, diagnosisType]
