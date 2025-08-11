

let courseData = {};


window.onload = () => {
  fetch("courses.json")
    .then(res => res.json())
    .then(data => { courseData = data; })
    .catch(err => console.error("Failed to load course data:", err));
};


function loadCourses() {
  const dept = document.getElementById("department").value;
  const semester = document.getElementById("semester").value;
  const container = document.getElementById("courseContainer");
  container.innerHTML = "";

  if (!dept || !semester) {
    container.innerHTML = "<p>Please select both department and semester.</p>";
    return;
  }

  const courses = courseData[dept]?.[semester];
  if (!courses?.length) {
    container.innerHTML = "<p>No course data found for this selection.</p>";
    return;
  }

  courses.forEach(course => {
    container.insertAdjacentHTML(
      "beforeend",
      `
        <div class="course-row">
          <span>${course.title} (${course.credit} Credit)</span>
          <select class="grade" data-credit="${course.credit}">
            <option value="">Select Grade</option>
            <option value="4.0">A+</option>
            <option value="3.75">A</option>
            <option value="3.5">A‑</option>
            <option value="3.25">B+</option>
            <option value="3.0">B</option>
            <option value="2.75">B‑</option>
            <option value="2.5">C+</option>
            <option value="2.25">C</option>
            <option value="2.0">D</option>
          </select>
        </div>
      `
    );
  });
}
const sem = document.getElementById("semester");
sem.addEventListener("change", loadCourses);


function calculateCGPA() {
  const selects = document.querySelectorAll(".grade");
  let totalCredits = 0;
  let totalPoints = 0;

  selects.forEach(sel => {
    const gpStr = sel.value.trim();           // "" ▸ not selected
    if (!gpStr) return;                        // skip unselected

    const gpNum = parseFloat(gpStr);
    if (isNaN(gpNum) || gpNum === 0) return;   // skip F / invalid

    const credit = parseFloat(sel.dataset.credit);
    totalCredits += credit;
    totalPoints += credit * gpNum;
  });

  const result = document.getElementById("result");
  if (!totalCredits) {
    result.textContent = "Please select at least one passing grade.";
    return;
  }

  result.textContent = `Your CGPA: ${(totalPoints / totalCredits).toFixed(2)}`;
}
