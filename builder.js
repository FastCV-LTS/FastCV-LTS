// Resume Builder JavaScript for FastCV-LTS

let currentTemplate = 'classic';
let currentPhoto = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize builder
    initializeBuilder();
    
    // Add event listeners for real-time preview
    addFormListeners();
    
    // Load saved data if exists
    loadSavedData();
    
    // Update preview initially
    updatePreview();
});

function initializeBuilder() {
    // Template selection
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            templateCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
            // Update current template
            currentTemplate = this.dataset.template;
            // Update preview
            updatePreview();
        });
    });
}

function addFormListeners() {
    // Get all form inputs
    const inputs = document.querySelectorAll('.retro-input, .retro-textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('keyup', updatePreview);
    });
}

function updatePreview() {
    const preview = document.getElementById('resumePreview');
    
    // Get form data
    const data = getFormData();
    
    // Update template class
    preview.className = `resume-preview ${currentTemplate}-template`;
    
    // Generate HTML based on template
    let html = generateResumeHTML(data, currentTemplate);
    
    preview.innerHTML = html;
}

function getFormData() {
    return {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        website: document.getElementById('website').value,
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skills').value,
        certifications: document.getElementById('certifications').value,
        experience: getExperienceData(),
        education: getEducationData(),
        photo: currentPhoto
    };
}

function getExperienceData() {
    const experiences = [];
    const experienceItems = document.querySelectorAll('.experience-item');
    
    experienceItems.forEach(item => {
        const jobTitle = item.querySelector('.job-title').value;
        const company = item.querySelector('.company').value;
        const startDate = item.querySelector('.start-date').value;
        const endDate = item.querySelector('.end-date').value;
        const description = item.querySelector('.job-description').value;
        
        if (jobTitle || company) {
            experiences.push({
                jobTitle,
                company,
                startDate,
                endDate,
                description
            });
        }
    });
    
    return experiences;
}

function getEducationData() {
    const education = [];
    const educationItems = document.querySelectorAll('.education-item');
    
    educationItems.forEach(item => {
        const degree = item.querySelector('.degree').value;
        const school = item.querySelector('.school').value;
        const year = item.querySelector('.year').value;
        
        if (degree || school) {
            education.push({
                degree,
                school,
                year
            });
        }
    });
    
    return education;
}

function generateResumeHTML(data, template) {
    let html = '';
    
    // Header with or without photo
    if (data.photo) {
        html += `<div class="resume-header-with-photo">`;
        html += `<div class="resume-header-info">`;
        if (data.fullName) {
            html += `<div class="resume-name">${data.fullName}</div>`;
        }
        
        let contactInfo = [];
        if (data.email) contactInfo.push(data.email);
        if (data.phone) contactInfo.push(data.phone);
        if (data.address) contactInfo.push(data.address);
        if (data.website) contactInfo.push(data.website);
        
        if (contactInfo.length > 0) {
            html += `<div class="resume-contact">${contactInfo.join(' | ')}</div>`;
        }
        html += `</div>`;
        html += `<div class="resume-header-photo">`;
        html += `<img src="${data.photo}" alt="Profile Photo" class="resume-photo">`;
        html += `</div>`;
        html += `</div>`;
    } else {
        html += `<div class="resume-header">`;
        if (data.fullName) {
            html += `<div class="resume-name">${data.fullName}</div>`;
        }
        
        let contactInfo = [];
        if (data.email) contactInfo.push(data.email);
        if (data.phone) contactInfo.push(data.phone);
        if (data.address) contactInfo.push(data.address);
        if (data.website) contactInfo.push(data.website);
        
        if (contactInfo.length > 0) {
            html += `<div class="resume-contact">${contactInfo.join(' | ')}</div>`;
        }
        html += `</div>`;
    }
    
    // Professional Summary
    if (data.summary) {
        html += `<div class="resume-section">`;
        html += `<h3>Professional Summary</h3>`;
        html += `<p>${data.summary}</p>`;
        html += `</div>`;
    }
    
    // Work Experience
    if (data.experience.length > 0) {
        html += `<div class="resume-section">`;
        html += `<h3>Work Experience</h3>`;
        
        data.experience.forEach(exp => {
            if (exp.jobTitle || exp.company) {
                html += `<div class="resume-item">`;
                html += `<div class="resume-item-header">`;
                html += `<div>`;
                if (exp.jobTitle) html += `<div class="resume-item-title">${exp.jobTitle}</div>`;
                if (exp.company) html += `<div class="resume-item-company">${exp.company}</div>`;
                html += `</div>`;
                if (exp.startDate || exp.endDate) {
                    html += `<div class="resume-item-date">${exp.startDate}${exp.endDate ? ' - ' + exp.endDate : ''}</div>`;
                }
                html += `</div>`;
                if (exp.description) {
                    html += `<div class="resume-item-description">${exp.description.replace(/\n/g, '<br>')}</div>`;
                }
                html += `</div>`;
            }
        });
        
        html += `</div>`;
    }
    
    // Education
    if (data.education.length > 0) {
        html += `<div class="resume-section">`;
        html += `<h3>Education</h3>`;
        
        data.education.forEach(edu => {
            if (edu.degree || edu.school) {
                html += `<div class="resume-item">`;
                html += `<div class="resume-item-header">`;
                html += `<div>`;
                if (edu.degree) html += `<div class="resume-item-title">${edu.degree}</div>`;
                if (edu.school) html += `<div class="resume-item-company">${edu.school}</div>`;
                html += `</div>`;
                if (edu.year) html += `<div class="resume-item-date">${edu.year}</div>`;
                html += `</div>`;
                html += `</div>`;
            }
        });
        
        html += `</div>`;
    }
    
    // Skills
    if (data.skills) {
        html += `<div class="resume-section">`;
        html += `<h3>Skills</h3>`;
        html += `<p>${data.skills}</p>`;
        html += `</div>`;
    }
    
    // Certifications
    if (data.certifications) {
        html += `<div class="resume-section">`;
        html += `<h3>Certifications & Achievements</h3>`;
        html += `<p>${data.certifications.replace(/\n/g, '<br>')}</p>`;
        html += `</div>`;
    }
    
    return html || '<p style="text-align: center; color: #999; margin-top: 50px;">Start filling out the form to see your resume preview here!</p>';
}

function addExperience() {
    const container = document.getElementById('experienceContainer');
    const newItem = document.createElement('div');
    newItem.className = 'experience-item';
    newItem.innerHTML = `
        <input type="text" placeholder="Job Title" class="retro-input job-title">
        <input type="text" placeholder="Company Name" class="retro-input company">
        <input type="text" placeholder="Start Date" class="retro-input start-date">
        <input type="text" placeholder="End Date (or 'Present')" class="retro-input end-date">
        <textarea placeholder="Job description and achievements..." class="retro-textarea job-description"></textarea>
        <button type="button" class="remove-btn" onclick="removeExperience(this)">Remove</button>
    `;
    
    container.appendChild(newItem);
    
    // Add event listeners to new inputs
    const newInputs = newItem.querySelectorAll('.retro-input, .retro-textarea');
    newInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('keyup', updatePreview);
    });
}

function removeExperience(button) {
    button.parentElement.remove();
    updatePreview();
}

function addEducation() {
    const container = document.getElementById('educationContainer');
    const newItem = document.createElement('div');
    newItem.className = 'education-item';
    newItem.innerHTML = `
        <input type="text" placeholder="Degree/Certification" class="retro-input degree">
        <input type="text" placeholder="School/Institution" class="retro-input school">
        <input type="text" placeholder="Year" class="retro-input year">
        <button type="button" class="remove-btn" onclick="removeEducation(this)">Remove</button>
    `;
    
    container.appendChild(newItem);
    
    // Add event listeners to new inputs
    const newInputs = newItem.querySelectorAll('.retro-input');
    newInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('keyup', updatePreview);
    });
}

function removeEducation(button) {
    button.parentElement.remove();
    updatePreview();
}

function downloadPDF() {
    const data = getFormData();
    
    // Check if user has entered basic information
    if (!data.fullName) {
        alert('Please enter your full name before downloading!');
        return;
    }
    
    // Show loading message
    const originalText = event.target.textContent;
    event.target.textContent = '📄 Generating PDF...';
    event.target.disabled = true;
    
    try {
        // Create new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set font
        doc.setFont('helvetica');
        
        let yPosition = 20;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        
        // Header with or without photo
        if (data.photo) {
            // Add circular photo to PDF
            try {
                const photoSize = 25;
                const photoX = pageWidth - margin - photoSize;
                const photoY = yPosition - 5;
                const centerX = photoX + photoSize / 2;
                const centerY = photoY + photoSize / 2;
                const radius = photoSize / 2;
                
                // Save the current graphics state
                doc.saveGraphicsState();
                
                // Create circular clipping path
                doc.circle(centerX, centerY, radius);
                doc.clip();
                
                // Add the image (it will be clipped to the circle)
                doc.addImage(data.photo, 'JPEG', photoX, photoY, photoSize, photoSize);
                
                // Restore graphics state to remove clipping
                doc.restoreGraphicsState();
                
                // Add circular border
                doc.setDrawColor(0, 0, 0); // Black border
                doc.setLineWidth(0.5);
                doc.circle(centerX, centerY, radius);
                doc.stroke();
                
                // Name and contact info (left side)
                if (data.fullName) {
                    doc.setFontSize(20);
                    doc.setFont('helvetica', 'bold');
                    doc.text(data.fullName, margin, yPosition + 10);
                    yPosition += 15;
                }
                
                let contactInfo = [];
                if (data.email) contactInfo.push(data.email);
                if (data.phone) contactInfo.push(data.phone);
                if (data.address) contactInfo.push(data.address);
                if (data.website) contactInfo.push(data.website);
                
                if (contactInfo.length > 0) {
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.text(contactInfo.join(' | '), margin, yPosition);
                    yPosition += 15;
                }
                
                // Ensure we're below the photo
                yPosition = Math.max(yPosition, photoY + photoSize + 10);
                
            } catch (error) {
                console.error('Error adding photo to PDF:', error);
                // Fallback to regular header if photo fails
                if (data.fullName) {
                    doc.setFontSize(20);
                    doc.setFont('helvetica', 'bold');
                    doc.text(data.fullName, pageWidth / 2, yPosition, { align: 'center' });
                    yPosition += 10;
                }
            }
        } else {
            // Regular header without photo
            if (data.fullName) {
                doc.setFontSize(20);
                doc.setFont('helvetica', 'bold');
                doc.text(data.fullName, pageWidth / 2, yPosition, { align: 'center' });
                yPosition += 10;
            }
            
            // Contact Info
            let contactInfo = [];
            if (data.email) contactInfo.push(data.email);
            if (data.phone) contactInfo.push(data.phone);
            if (data.address) contactInfo.push(data.address);
            if (data.website) contactInfo.push(data.website);
            
            if (contactInfo.length > 0) {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(contactInfo.join(' | '), pageWidth / 2, yPosition, { align: 'center' });
                yPosition += 15;
            }
        }
        
        // Professional Summary
        if (data.summary) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
            yPosition += 8;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const summaryLines = doc.splitTextToSize(data.summary, contentWidth);
            doc.text(summaryLines, margin, yPosition);
            yPosition += summaryLines.length * 5 + 10;
        }
        
        // Work Experience
        if (data.experience.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('WORK EXPERIENCE', margin, yPosition);
            yPosition += 8;
            
            data.experience.forEach(exp => {
                if (exp.jobTitle || exp.company) {
                    // Job title and dates
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    if (exp.jobTitle) {
                        doc.text(exp.jobTitle, margin, yPosition);
                    }
                    
                    if (exp.startDate || exp.endDate) {
                        const dateText = `${exp.startDate}${exp.endDate ? ' - ' + exp.endDate : ''}`;
                        doc.text(dateText, pageWidth - margin, yPosition, { align: 'right' });
                    }
                    yPosition += 6;
                    
                    // Company
                    if (exp.company) {
                        doc.setFontSize(10);
                        doc.setFont('helvetica', 'italic');
                        doc.text(exp.company, margin, yPosition);
                        yPosition += 6;
                    }
                    
                    // Description
                    if (exp.description) {
                        doc.setFontSize(10);
                        doc.setFont('helvetica', 'normal');
                        const descLines = doc.splitTextToSize(exp.description, contentWidth);
                        doc.text(descLines, margin, yPosition);
                        yPosition += descLines.length * 4 + 8;
                    }
                    
                    yPosition += 5;
                }
            });
        }
        
        // Education
        if (data.education.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('EDUCATION', margin, yPosition);
            yPosition += 8;
            
            data.education.forEach(edu => {
                if (edu.degree || edu.school) {
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    if (edu.degree) {
                        doc.text(edu.degree, margin, yPosition);
                    }
                    
                    if (edu.year) {
                        doc.text(edu.year, pageWidth - margin, yPosition, { align: 'right' });
                    }
                    yPosition += 6;
                    
                    if (edu.school) {
                        doc.setFontSize(10);
                        doc.setFont('helvetica', 'italic');
                        doc.text(edu.school, margin, yPosition);
                        yPosition += 8;
                    }
                }
            });
        }
        
        // Skills
        if (data.skills) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('SKILLS', margin, yPosition);
            yPosition += 8;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const skillsLines = doc.splitTextToSize(data.skills, contentWidth);
            doc.text(skillsLines, margin, yPosition);
            yPosition += skillsLines.length * 5 + 10;
        }
        
        // Certifications
        if (data.certifications) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('CERTIFICATIONS & ACHIEVEMENTS', margin, yPosition);
            yPosition += 8;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const certLines = doc.splitTextToSize(data.certifications, contentWidth);
            doc.text(certLines, margin, yPosition);
        }
        
        // Save the PDF
        const fileName = data.fullName ? `${data.fullName.replace(/\s+/g, '_')}_Resume.pdf` : 'My_Resume.pdf';
        doc.save(fileName);
        
        // Show success message
        alert('✅ PDF downloaded successfully!');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('❌ Error generating PDF. Please try again.');
    } finally {
        // Reset button
        event.target.textContent = originalText;
        event.target.disabled = false;
    }
}

function clearAll() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        // Clear all form inputs
        const inputs = document.querySelectorAll('.retro-input, .retro-textarea');
        inputs.forEach(input => input.value = '');
        
        // Remove extra experience and education items
        const experienceItems = document.querySelectorAll('.experience-item');
        for (let i = 1; i < experienceItems.length; i++) {
            experienceItems[i].remove();
        }
        
        const educationItems = document.querySelectorAll('.education-item');
        for (let i = 1; i < educationItems.length; i++) {
            educationItems[i].remove();
        }
        
        // Reset template selection
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector('.template-card[data-template="classic"]').classList.add('active');
        currentTemplate = 'classic';
        
        // Clear photo
        removePhoto();
        
        // Clear saved data
        localStorage.removeItem('fastcv_resume_data');
        
        // Update preview
        updatePreview();
        
        alert('✅ All data cleared!');
    }
}

function saveProgress() {
    const data = getFormData();
    data.template = currentTemplate;
    data.photo = currentPhoto;
    
    try {
        localStorage.setItem('fastcv_resume_data', JSON.stringify(data));
        alert('✅ Progress saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('❌ Error saving progress. Please try again.');
    }
}

function loadSavedData() {
    try {
        const savedData = localStorage.getItem('fastcv_resume_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Load basic fields
            if (data.fullName) document.getElementById('fullName').value = data.fullName;
            if (data.email) document.getElementById('email').value = data.email;
            if (data.phone) document.getElementById('phone').value = data.phone;
            if (data.address) document.getElementById('address').value = data.address;
            if (data.website) document.getElementById('website').value = data.website;
            if (data.summary) document.getElementById('summary').value = data.summary;
            if (data.skills) document.getElementById('skills').value = data.skills;
            if (data.certifications) document.getElementById('certifications').value = data.certifications;
            
            // Load template
            if (data.template) {
                currentTemplate = data.template;
                document.querySelectorAll('.template-card').forEach(card => {
                    card.classList.remove('active');
                });
                document.querySelector(`[data-template="${data.template}"]`).classList.add('active');
            }
            
            // Load photo
            if (data.photo) {
                currentPhoto = data.photo;
                const photoPreview = document.getElementById('photoPreview');
                photoPreview.innerHTML = `<img src="${currentPhoto}" alt="Profile Photo">`;
                document.getElementById('removePhotoBtn').style.display = 'block';
            }
            
            // Load experience data
            if (data.experience && data.experience.length > 0) {
                const container = document.getElementById('experienceContainer');
                container.innerHTML = ''; // Clear existing
                
                data.experience.forEach(exp => {
                    const item = document.createElement('div');
                    item.className = 'experience-item';
                    item.innerHTML = `
                        <input type="text" placeholder="Job Title" class="retro-input job-title" value="${exp.jobTitle || ''}">
                        <input type="text" placeholder="Company Name" class="retro-input company" value="${exp.company || ''}">
                        <input type="text" placeholder="Start Date" class="retro-input start-date" value="${exp.startDate || ''}">
                        <input type="text" placeholder="End Date (or 'Present')" class="retro-input end-date" value="${exp.endDate || ''}">
                        <textarea placeholder="Job description and achievements..." class="retro-textarea job-description">${exp.description || ''}</textarea>
                        <button type="button" class="remove-btn" onclick="removeExperience(this)">Remove</button>
                    `;
                    container.appendChild(item);
                });
            }
            
            // Load education data
            if (data.education && data.education.length > 0) {
                const container = document.getElementById('educationContainer');
                container.innerHTML = ''; // Clear existing
                
                data.education.forEach(edu => {
                    const item = document.createElement('div');
                    item.className = 'education-item';
                    item.innerHTML = `
                        <input type="text" placeholder="Degree/Certification" class="retro-input degree" value="${edu.degree || ''}">
                        <input type="text" placeholder="School/Institution" class="retro-input school" value="${edu.school || ''}">
                        <input type="text" placeholder="Year" class="retro-input year" value="${edu.year || ''}">
                        <button type="button" class="remove-btn" onclick="removeEducation(this)">Remove</button>
                    `;
                    container.appendChild(item);
                });
            }
            
            // Re-add event listeners
            addFormListeners();
            
            console.log('✅ Saved data loaded successfully!');
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

// Photo handling functions
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('❌ Photo size must be less than 5MB');
            return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('❌ Please select a valid image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            currentPhoto = e.target.result;
            
            // Update preview
            const photoPreview = document.getElementById('photoPreview');
            photoPreview.innerHTML = `<img src="${currentPhoto}" alt="Profile Photo">`;
            
            // Show remove button
            document.getElementById('removePhotoBtn').style.display = 'block';
            
            // Update resume preview
            updatePreview();
        };
        
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    currentPhoto = null;
    
    // Reset file input
    document.getElementById('photoUpload').value = '';
    
    // Reset preview
    const photoPreview = document.getElementById('photoPreview');
    photoPreview.innerHTML = `
        <div class="photo-placeholder">
            <span class="photo-icon">📷</span>
            <span class="photo-text">Click to upload photo</span>
        </div>
    `;
    
    // Hide remove button
    document.getElementById('removePhotoBtn').style.display = 'none';
    
    // Update resume preview
    updatePreview();
}