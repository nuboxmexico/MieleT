import axios from 'axios'

export async function filterOptions() {
  try {
    const { data } = await axios.get('/api/v1/services/filter_options')
    return data
  } catch (e) {
    console.log();
  }
}
