<template>
    <Sidebar />
    <div class="container mt-5">
        <h2>Section List</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date created</th>
                    <th>No of books</th>                    

                </tr>
            </thead>
            <tbody>
                
                <tr v-for="section in sections" :key="section.section_id">
                    <td>{{ section.section_id }}</td>
                    <td>{{ section.section_name }}</td>
                    <td>{{ section.created_at }}</td>
                    <td>{{ section.book_count }}</td>
                    <td>
                        <!-- <a href="{{ url_for('manage_section', section_id=section.section_id )}}"> -->
                        <span class="badge bg-primary rounded-pill">Manage books</span></td>
                        <!-- </a> -->
                    <td>
                        <!-- <a href="{{ url_for('delete_section', section_id=section.section_id )}}"> -->
                        <span class="badge bg-danger rounded-pill">Delete</span></td>
                        <!-- </a> -->
                </tr>
                
            </tbody>
        </table>
    </div>
</template>

<script setup>
import Sidebar from '@/components/SidebarLine.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const sections = ref([])

const getSections = async() => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/api/sections')
        sections.value = response.data.sections
    } catch(error){
        console.error("Error fetching sections", error)
    }
}

onMounted(() => {
    getSections()
})

</script>