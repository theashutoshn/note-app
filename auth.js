import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient("https://zanjbmsolrqdaikwzzpl.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbmpibXNvbHJxZGFpa3d6enBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTQ5MzEsImV4cCI6MjA3MzY3MDkzMX0.pBd3ArobSnWvCGOuGUEguQe5xz4O-g_gC4Ip-QocbPg");

// If already logged in, go to app
const { data: { session } } = await supabase.auth.getSession();
if (session) {
    window.location.replace("index.html");
}



document.getElementById("signup").addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        console.log(error.message);
        return
    }

    if (!data.session) {
        show("Signup successful. Check your email to confirm, then log in.");
        return;
    }


    location.href = "index.html";
});

document.getElementById("login").addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { console.log(error.message); return; }
    location.href = "index.html";
});