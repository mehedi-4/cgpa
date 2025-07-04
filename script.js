let courseData = {};

// Load the courses.json when the page loads
window.onload = function () {
  fetch("courses.json")
    .then(res => res.json())
    .then(data => {
      courseData = data;
    })
    .catch(err => {
      console.error("Failed to load course data:", err);
    });
};

// Called when "Load Courses" is clicked
function loadCourses() {
  const dept = document.getElementById("department").value;
  const sem = document.getElementById("semester").value;
  const container = document.getElementById("courseContainer");
  container.innerHTML = "";

  if (!dept || !sem) {
    container.innerHTML = "<p>Please select both department and semester.</p>";
    return;
  }

  const courses = courseData[dept]?.[sem];

  if (!courses || courses.length === 0) {
    container.innerHTML = "<p>No course data found for this selection.</p>";
    return;
  }

  // Display each course with credit and grade dropdown
  courses.forEach(course => {
    const row = document.createElement("div");
    row.className = "course-row";
    row.innerHTML = `
      <span>${course.title} (${course.credit} Credit)</span>
      <select class="grade" data-credit="${course.credit}">
        <option value="">Select Grade</option>
        <option value="4.0">A+</option>
        <option value="3.75">A</option>
        <option value="3.5">A-</option>
        <option value="3.25">B+</option>
        <option value="3.0">B</option>
        <option value="2.75">B-</option>
        <option value="2.5">C+</option>
        <option value="2.25">C</option>
        <option value="2.0">D</option>
        <option value="0.0">F</option>
      </select>
    `;
    container.appendChild(row);
  });
}

// Calculate CGPA (skips unselected courses)
function calculateCGPA() {
  const grades = document.querySelectorAll(".grade");
  let totalCredits = 0, totalPoints = 0;

  grades.forEach(select => {
    const credit = parseFloat(select.dataset.credit);
    const grade = parseFloat(select.value);

    if (!isNaN(grade)) {
      totalCredits += credit;
      totalPoints += credit * grade;
    }
  });

  const result = document.getElementById("result");

  if (totalCredits === 0) {
    result.textContent = "Please select at least one grade.";
    return;
  }

  const cgpa = (totalPoints / totalCredits).toFixed(2);
  result.textContent = `Your CGPA: ${cgpa}`;
}
