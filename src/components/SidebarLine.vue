<template>
    <div class="sidebar">
        <!-- <h2 class="text-white text-center sidebar-title">Library</h2> -->
        <ul class="nav flex-column">
          <li class="nav-item"><router-link to="/dashboard" class="nav-link text-white">Dashboard</router-link></li>
          <li class="nav-item"><router-link to="/users" class="nav-link text-white">Users</router-link></li>
          <li class="nav-item"><router-link to="/books" class="nav-link text-white">Books</router-link></li>
          <li class="nav-item"><router-link to="/requests" class="nav-link text-white">Requests</router-link></li>
          <li class="nav-item"><router-link to="/add-book" class="nav-link text-white">Add book</router-link></li>
          <li class="nav-item"><router-link to="/add-section" class="nav-link text-white">Add section</router-link></li>
          <li class="nav-item"><router-link to="/sections" class="nav-link text-white">Manage section</router-link></li>
          <li class="nav-item"><router-link to="/payment" class="nav-link text-white">Payments</router-link></li>
        </ul>
      </div>
    </template>