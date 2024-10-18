// logout
async function logout() {
  try {
    // send POST req
    const response = await fetch("/api/users/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (!result.success) return;
    window.location.href = "/";
    return;
  } catch (error) {
    console.error({ logout_error: error });
  }
}

function goTo(path) {
  window.location.href = path;
}
