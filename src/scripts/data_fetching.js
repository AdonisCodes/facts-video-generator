import axios from "axios"

export async function fetchFacts(factsTotal, apiKey) {
    const config = {
        headers: {"X-Api-Key": apiKey}
    }

    let facts = await axios.get(`https://api.api-ninjas.com/v1/facts?limit=${factsTotal}`, config)
    let result = await facts.data

    return result
}