import React, { useState, useEffect } from "react";
import Files from "react-files";

import "../styles/Form.scss";

const Form = ({ data, setData, preset, setColor }) => {
  let { name, photoUrl, location, phone, email, linkedin, github } =
    data.contact;
  let languages = data.languages;
  let references = data.references;
  let objective = data.objective;
  let education = data.education;
  let experience = data.experience;
  let certifications = data.certifications;
  let projects = data.projects;
  let projects_link = data.projects_link;
  let workshops = data.workshops;
  let activities = data.activities;

  const [selectedColor, setSelectedColor] = useState(preset[0]);

  // Handle JSON file upload
  const handleFileUpload = (files) => {
    var fileReader = new FileReader();
    fileReader.onload = (event) => {
      const temp = JSON.parse(event.target.result);
      console.log(temp);
      setData(temp);
      event.target.value = null;
    };
    fileReader.readAsText(files[files.length - 1]);
  };

  // Handle JSON file download
  const handleFileDownload = async () => {
    const fileName = "resume";
    const json = JSON.stringify(data, undefined, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle photo upload
  const handlePhotoUpload = (files) => {
    setData({
      ...data,
      contact: {
        ...data.contact,
        photoUrl: URL.createObjectURL(files[files.length - 1]),
      },
    });
  };

  // skills
  const [skills, setSkills] = useState("");
  useEffect(() => {
    let temp = "";
    data.skills.map((item) => (temp = temp + item + ","));
    temp = temp.slice(0, -1);
    setSkills(temp);
  }, [data]);

  // Tools
  const [tools, setTools] = useState("");
  useEffect(() => {
    let temp = "";
    data.tools.map((item) => (temp = temp + item + ","));
    temp = temp.slice(0, -1);
    setTools(temp);
  }, [data]);

  // interests
  const [interests, setInterests] = useState("");
  useEffect(() => {
    let temp = "";
    data.interests.map((item) => (temp = temp + item + ","));
    temp = temp.slice(0, -1);
    setInterests(temp);
  }, [data]);

  // Contact
  const handleContactChange = (e) => {
    setData({
      ...data,
      contact: {
        ...data.contact,
        [e.target.name]: e.target.value,
      },
    });
  };

  // Skills
  const handleSkillsUpdate = () => {
    var array = skills.split(",");
    setData({
      ...data,
      skills: array,
    });
  };

  // Tools
  const handleToolsUpdate = () => {
    var array = tools.split(",");
    setData({
      ...data,
      tools: array,
    });
  };

  // Interests
  const handleInterestsUpdate = () => {
    var array = interests.split(",");
    setData({
      ...data,
      interests: array,
    });
  };

  // Add Row
  const addRow = (section, structure) => {
    let temp = section;
    temp.push(structure);
    setData({
      ...data,
      section: temp,
    });
  };

  // Remove Row
  const removeRow = (section, index) => {
    let temp = section;
    temp[index] = {};
    temp.splice(index, 1);
    setData({
      ...data,
      section: temp,
    });
  };

  // Handle Change
  const handleChange = (e, index, section, type) => {
    let temp = section;
    temp[index][type] = e.target.value;

    if (section === languages && type === "level") {
      if (e.target.value > 5) {
        temp[index][type] = 5;
      } else if (e.target.value < 1) {
        temp[index][type] = 1;
      } else {
        temp[index][type] = e.target.value;
      }
    }

    setData({
      ...data,
      section: temp,
    });
  };

  // Handle color scheme change
  const changeColorScheme = (item) => {
    setColor({
      primary: item.primary,
      background: item.background,
      skills: item.skills,
    });
    setSelectedColor(item);
  };

  return (
    <div className="form-container">
      <div className="my-3">
        <div className="logo-container" style={{ marginTop: '-20px', marginBottom: '10px' }}>
          <img src="/images/logo.svg" alt="Logo" style={{ height: '65px', width: 'auto' }} />
        </div>
        <div className="colorSchemeContainer">
          <p className="color-scheme-title">Select color scheme:</p>
          <div className="colorContainer">
            {preset.map((item, key) => (
              <div
                key={key}
                className={`colorScheme ${selectedColor === item ? 'active' : ''}`}
                onClick={() => changeColorScheme(item)}
                style={{ backgroundColor: `${item.primary}` }}
              ></div>
            ))}
          </div>
        </div>

        <div className="file-buttons-container">
          <div title="Populate resume data from JSON file">
            <Files
              className="files-dropzone file-btn"
              onChange={(files) => handleFileUpload(files)}
              onError={(err) => console.log(err)}
              accepts={[".json"]}
              multiple
              maxFiles={100}
              maxFileSize={10000000}
              minFileSize={0}
              clickable
            >
              <i className="fas fa-upload"></i> Upload JSON
            </Files>
          </div>

          <button
            className="file-btn"
            title="Download resume data as JSON file"
            onClick={handleFileDownload}
          >
            <i className="fas fa-download"></i> Download JSON
          </button>

          <div>
            <Files
              className="files-dropzone file-btn"
              onChange={(files) => handlePhotoUpload(files)}
              onError={(err) => console.log(err)}
              accepts={["image/jpeg", "image/jpg", "image/png", "image/svg"]}
              multiple
              maxFiles={100}
              maxFileSize={10000000}
              minFileSize={0}
              clickable
            >
              <i className="fas fa-image"></i> Upload Photo
            </Files>
          </div>
        </div>
      </div>

      <div className="form">
        <div className="section">
          <div className="heading">
            <span>PERSONAL INFORMATION</span>
            <button className="done-btn" aria-label="Done"></button>
          </div>
          <p className="label">Name</p>
          {/* <span>Please use your full name</span> */}
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleContactChange}
          />
          <p className="label">PHOTO URL</p>
          <input
            type="text"
            name="photoUrl"
            value={photoUrl}
            onChange={handleContactChange}
          />
          <p className="label">LOCATION</p>
          <input
            type="text"
            name="location"
            value={location}
            onChange={handleContactChange}
          />
          <p className="label">PHONE</p>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={handleContactChange}
          />
          <p className="label">EMAIL</p>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleContactChange}
          />
          <p className="label">LINKEDIN</p>
          <input
            type="text"
            name="linkedin"
            value={linkedin}
            onChange={handleContactChange}
          />
          <p className="label">GITHUB</p>
          <input
            type="text"
            name="github"
            value={github}
            onChange={handleContactChange}
          />
        </div>

        <div className="section">
          <div className="heading">
            <span>SKILLS</span>
            <button
              className="done-btn"
              onClick={handleSkillsUpdate}
              aria-label="Done"
            ></button>
          </div>
          <textarea
            name="skills"
            cols="50"
            rows="5"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          ></textarea>
        </div>

        <div className="section">
          <div className="heading">
            <span>TOOLS</span>
            <button
              className="done-btn"
              onClick={handleToolsUpdate}
              aria-label="Done"
            ></button>
          </div>
          <textarea
            name="skills"
            cols="50"
            rows="3"
            value={tools}
            onChange={(e) => setTools(e.target.value)}
          ></textarea>
        </div>

        <div className="section">
          <div className="heading">
            <span>LANGUAGES</span>
            <button
              className="add-btn"
              onClick={() => addRow(languages, { name: "", level: "5" })}
              aria-label="Add Language"
            ></button>
          </div>
          {languages.map((language, index) => (
            <div className="row" key={index}>
              <div className="ml-2 mr-2">
                <input
                  type="text"
                  name="language"
                  placeholder="Language"
                  value={language.language}
                  onChange={(e) =>
                    handleChange(e, index, languages, "language")
                  }
                />
                <input
                  type="number"
                  name="level"
                  placeholder="Level"
                  value={language.level}
                  onChange={(e) => handleChange(e, index, languages, "level")}
                />
              </div>
              <button
                className="remove-btn"
                onClick={() => removeRow(languages, index)}
                aria-label="Remove Language"
              ></button>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="heading">
            <span>INTERESTS</span>
            <button
              className="done-btn"
              onClick={handleInterestsUpdate}
              aria-label="Done"
            ></button>
          </div>
          <textarea
            name="skills"
            cols="50"
            rows="5"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          ></textarea>
        </div>

        <div className="section">
          <div className="heading">
            <span>REFERENCES</span>
            <button
              className="add-btn"
              onClick={() =>
                addRow(references, {
                  name: "",
                  designation: "",
                  institute: "",
                  email: "",
                  phone: "",
                })
              }
            >
              Add Reference
            </button>
          </div>
          {references.map((item, index) => (
            <div className="row" key={index}>
              <div className="item">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) => handleChange(e, index, references, "name")}
                />
                <textarea
                  name="desig"
                  cols="30"
                  rows="3"
                  placeholder="Designation"
                  value={item.desig}
                  onChange={(e) => handleChange(e, index, references, "desig")}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone number"
                  value={item.phone}
                  onChange={(e) => handleChange(e, index, references, "phone")}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={item.email}
                  onChange={(e) => handleChange(e, index, references, "email")}
                />
              </div>
              <button
                className="remove-btn"
                onClick={() => removeRow(references, index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="heading">
          <span>OBJECTIVE</span>
          </div>
          <textarea
            name="objective"
            cols="50"
            rows="5"
            value={objective}
            onChange={(e) => setData({ ...data, objective: e.target.value })}
          ></textarea>
        </div>

        <div className="section">
          <div className="heading">
            <span>EDUCATION</span>
            <button
              className="add-btn"
              onClick={() =>
                addRow(education, { institute: "", year: "", degree: "" })
              }
            >
              Add Education
            </button>
          </div>
          {education.map((item, index) => (
            <div className="row" key={index}>
              <div className="item">
                <input
                  type="text"
                  name="year"
                  placeholder="Year"
                  value={item.year}
                  onChange={(e) => handleChange(e, index, education, "year")}
                />
                <input
                  type="text"
                  name="course"
                  placeholder="Course/Degree"
                  value={item.course}
                  onChange={(e) => handleChange(e, index, education, "course")}
                />
                <input
                  type="text"
                  name="institution"
                  placeholder="School/College"
                  value={item.institution}
                  onChange={(e) =>
                    handleChange(e, index, education, "institution")
                  }
                />
                <input
                  type="text"
                  name="university"
                  placeholder="Board/University"
                  value={item.university}
                  onChange={(e) =>
                    handleChange(e, index, education, "university")
                  }
                />
                <input
                  type="number"
                  name="percentage"
                  placeholder="Percentage/GPA"
                  value={item.percentage}
                  onChange={(e) =>
                    handleChange(e, index, education, "percentage")
                  }
                />
                <input
                  type="text"
                  name="achievements"
                  placeholder="Achievements"
                  value={item.achievements}
                  onChange={(e) =>
                    handleChange(e, index, education, "achievements")
                  }
                />
              </div>
              <button
                className="remove-btn"
                onClick={() => removeRow(education, index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="heading">
            <span>EXPERIENCE</span>
            <button
              className="add-btn"
              onClick={() =>
                addRow(experience, {
                  company: "",
                  year: "",
                  designation: "",
                  description: "",
                })
              }
            >
              Add Experience
            </button>
          </div>
          {experience.map((item, index) => (
            <div className="row" key={index}>
              <div className="item">
                <input
                  type="text"
                  name="year"
                  placeholder="Year"
                  value={item.year}
                  onChange={(e) => handleChange(e, index, experience, "year")}
                />
                <input
                  type="text"
                  name="position"
                  placeholder="Role/Position"
                  value={item.position}
                  onChange={(e) =>
                    handleChange(e, index, experience, "position")
                  }
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={item.company}
                  onChange={(e) =>
                    handleChange(e, index, experience, "company")
                  }
                />
                <textarea
                  name="description"
                  cols="30"
                  rows="5"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleChange(e, index, experience, "description")
                  }
                />
              </div>
              <button
                className="remove-btn"
                onClick={() => removeRow(experience, index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="heading">
            <span>CERTIFICATIONS</span>
            <button
              className="add-btn"
              onClick={() =>
                addRow(certifications, {
                  name: "",
                  authority: "",
                  year: "",
                  link: "",
                })
              }
            >
              Add Certification
            </button>
          </div>
          {certifications.map((item, index) => (
            <div className="row" key={index}>
              <div className="item">
                <input
                  type="text"
                  name="year"
                  placeholder="Year"
                  value={item.year}
                  onChange={(e) =>
                    handleChange(e, index, certifications, "year")
                  }
                />
                <input
                  type="text"
                  name="course"
                  placeholder="Course"
                  value={item.course}
                  onChange={(e) =>
                    handleChange(e, index, certifications, "course")
                  }
                />
                <input
                  type="text"
                  name="institution"
                  placeholder="Institution"
                  value={item.institution}
                  onChange={(e) =>
                    handleChange(e, index, certifications, "institution")
                  }
                />
                <input
                  type="text"
                  name="score"
                  placeholder="Score"
                  value={item.score}
                  onChange={(e) =>
                    handleChange(e, index, certifications, "score")
                  }
                />
                <textarea
                  name="description"
                  cols="30"
                  rows="5"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleChange(e, index, certifications, "description")
                  }
                />
              </div>
              <button
                className="remove-btn"
                onClick={() => removeRow(certifications, index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="heading">
            <span>PROJECTS</span>
            <button
              className="add-btn"
              onClick={() =>
                addRow(projects, { name: "", description: "", link: "" })
              }
            >
              Add Project
            </button>
          </div>
          {projects.map((item, index) => (
            <div className="row" key={index}>
              <div className="item">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => handleChange(e, index, projects, "title")}
                />
                <input
                  type="text"
                  name="link"
                  placeholder="Project URL"
                  value={item.link}
                  onChange={(e) => handleChange(e, index, projects, "link")}
                />
                <textarea
                  name="description"
                  cols="30"
                  rows="5"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleChange(e, index, projects, "description")
                  }
                />
              </div>
              <button
                className="remove-btn"
                onClick={() => removeRow(projects, index)}
              >
                Remove
              </button>
            </div>
          ))}
          <input
            type="text"
            name="projects_link"
            placeholder="URL of More Projects"
            value={projects_link}
            onChange={(e) =>
              setData({ ...data, projects_link: e.target.value })
            }
          />
        </div>

        <div className="section">
          <div className="heading">
            <span>WORKSHOPS</span>
            <button
              className="add-btn"
              onClick={() => addRow(workshops, { name: "", description: "" })}
            >
              Add Workshop
            </button>
          </div>
          {workshops.map((item, index) => (
            <div className="row" key={index}>
              <div className="item">
                <input
                  type="text"
                  name="year"
                  placeholder="Year"
                  value={item.year}
                  onChange={(e) => handleChange(e, index, workshops, "year")}
                />
                <textarea
                  name="description"
                  cols="30"
                  rows="5"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleChange(e, index, workshops, "description")
                  }
                />
              </div>
              <button
                className="remove-btn"
                onClick={() => removeRow(workshops, index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="heading">
              <span>ADDITIONAL ACTIVITIES</span>
            <button
              className="add-btn"
              onClick={() => addRow(activities, { title: "" })}
            >
              Add
            </button>
          </div>
          {activities.map((item, index) => (
            <div className="container-fluid" key={index}>
              <div className="row item">
                <input
                  type="text"
                  name="title"
                  placeholder="Activities"
                  value={item.title}
                  onChange={(e) => handleChange(e, index, activities, "title")}
                />
              </div>
              <div className="row">
                <button
                  className="remove-btn"
                  onClick={() => removeRow(activities, index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Form;
