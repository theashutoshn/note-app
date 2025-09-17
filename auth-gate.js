import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

window.supabase = createClient("https://zanjbmsolrqdaikwzzpl.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbmpibXNvbHJxZGFpa3d6enBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTQ5MzEsImV4cCI6MjA3MzY3MDkzMX0.pBd3ArobSnWvCGOuGUEguQe5xz4O-g_gC4Ip-QocbPg");

function currentPage() {
    const p = location.pathname.split("/").pop();
    return p || "index.html";
}

const page = currentPage();

const { data: { session } } = await window.supabase.auth.getSession();

if (!session && page !== "auth.html") {
    location.href = "auth.html";
}

if (session && page === "auth.html") {
    location.href = "index.html";
}

window.supabase.auth.onAuthStateChange((_event, sess) => {
    const onAuth = currentPage() === "auth.html";
    if (!sess && !onAuth) location.href = "auth.html";
    if (sess && onAuth) location.href = "index.html";
});