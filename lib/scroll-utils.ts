export function scrollToSection(sectionId: string) {
  const section = document.getElementById(sectionId)
  if (section) {
    // Get the height of the navbar (assuming it's fixed at the top)
    const navbarHeight = 80 // Adjust this value based on your navbar height

    // Calculate the position to scroll to (element position - navbar height)
    const offsetPosition = section.offsetTop - navbarHeight

    // Scroll to that position
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}
