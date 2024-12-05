import axios from 'axios'

export async function getAllCostCenters() {
  try {
    const { data } = await axios.get('/api/v1/cost_centers')
    return data
  } catch (e) {
    console.log(e)
  }
}
