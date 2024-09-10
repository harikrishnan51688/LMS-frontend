import axios from "axios";

export async function searchBooks(searchQuery, setBooks, setIsSearching) {
    if (!searchQuery){
        setBooks([])
        setIsSearching(false)
        return;
    }
    try {
        const response = await axios.get('http://localhost:5000/api/search', {
            params: { 
                query: searchQuery
            }
        })
        setBooks(response.data.book)
        setIsSearching(true)
        console.log(response.data)
    } catch(error) {
        console.error("Error fetching search query", error)
    }
}