const openPopupBtn = document.querySelector('.open-popup-btn');
const popupForm = document.getElementById('popupForm');
const overlay = document.querySelector('.overlay');
const closePopup = document.getElementById('closePopup');

// Open popup
openPopupBtn.addEventListener('click', () => {
  popupForm.style.display = 'block';
  overlay.style.display = 'block';
});

// Close popup
closePopup.addEventListener('click', () => {
  popupForm.style.display = 'none';
  overlay.style.display = 'none';
});

overlay.addEventListener('click', () => {
  popupForm.style.display = 'none';
  overlay.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#data-table');
  // Fetch data from the API
  fetch('http://localhost:5000/api/tabel') // Adjust the URL as needed
    .then(response => response.json())
    .then(data => {

      const tableData = data.floods;

      // Clear existing rows
      tableBody.innerHTML = '';

      // Add rows dynamically
      tableData.forEach(item => {
        const row = document.createElement('tr');
        row.setAttribute('row_id', item.FID);
        row.innerHTML = `
                <td scope="col" class="text-center text-dark" >${item.FID + 1}</td>
                <td scope="col" class="text-dark">${item.NAMA}</td>
                <td scope="col" class="text-center text-dark">${item.X}</td>
                <td scope="col" class="text-center text-dark">${item.Y}</td>
                <td scope="col" class="text-center"><img src=${item.FOTO} alt="Gambar jalan" width="500px" height="300px"></td>
                <td scope="col"class="text-center"><a class="deleteLink" href="#" >Delete</a></td>
                
          `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      tableBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-danger text-center">Failed to load data</td>
          </tr>
        `;
    });

    const table = document.getElementById('tabelBanjir');
    table.addEventListener('click', function(event) {
        // Check if the clicked target is a row or a delete link
        if (event.target.closest('tr')) {
            const row = event.target.closest('tr');
            const id = row.getAttribute('row_id');

            // Check if clicked on the delete link
            if (event.target.classList.contains('deleteLink')) {
                const isConfirmed = confirm(`Apakah anda yakin ingin menghapus data?`);

                if (isConfirmed) {
                    fetch(`http://localhost:5000/api/banjir/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    .then(response => response.json())
                    .then(data => {                    
                      row.remove();  // Remove the row from the table
                      alert('Data berhasil dihapus');
                    })
                    .catch(error => {
                        console.error('Error deleting user:', error);
                        alert('There was an error deleting the user.');
                    });
                }
            }
        }
    });
});

document.getElementById('data-form').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the form from submitting normally
  const formData = new FormData();
  formData.append('fid', document.getElementById('fid').value);
  formData.append('nama', document.getElementById('nama').value);
  formData.append('x', document.getElementById('x').value);
  formData.append('y', document.getElementById('y').value);
  formData.append('foto', document.getElementById('foto').files[0]);

  // Send data as JSON to the Express API
  fetch('http://localhost:5000/api/banjir', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      alert('Data berhasil dimasukkan');
      location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
    });
});