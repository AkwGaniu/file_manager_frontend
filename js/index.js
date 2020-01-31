const container = document.querySelector("#file_holder")
const search_container = document.querySelector("#search_file_holder")
const fileInput = document.getElementById('files')
const base_url = `http://localhost:3000/`
if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect, false);

}

// document.addEventListener('DOMContentLoaded', () => {
//     
// })


// FETCH URL
const fetch_files = () => {
   let user = JSON.parse(localStorage.getItem("user"))
    let url = `http://localhost:3000/file/fetch_files/${user.userId}`
    const fetchData  = {
        method: 'get'
    }
    fetch(url, fetchData)
        .then(resp => {
            if(resp.ok) {
                return resp.json()
            } else {
                return Promise.reject("Oops!!! Something went wrong.")
            }
        })
        .then(data => {
            container.innerHTML = ""
            let sn = 1
            for (file of data.file) {
                let time = file.time_created.slice(0, 5)
                let tr = document.createElement("tr")
                tr.innerHTML =  `
                <td>${sn++}</td  >
                <td>${file.file_name}</td>
                <td>${file.date_created +" "+ time}</td>
                <td>${file.file_type}</td>
                <td>${data.user.name}</td>
                <td> 
                    <button onclick="preview_file('${file.file_name}')" class="btn btn-success"><i class="fa fa-eye"></i></button>
                    <button onclick="delete_file('${file.file_name}')" class="btn btn-danger"><i class="fa fa-trash"></i></button>
                    <button onclick="download_file('${file.file_name}')" class="btn btn-dark"><i class="fa fa-download"></i></button>
                </td>`
                container.append(tr)

            }
        })
        .catch(error => {
            console.log(error)
        })

}

// SEARCH URL
const search = () => {
    user = JSON.parse(localStorage.getItem("user"))
    let search_key = document.querySelector("#search-input").value
    if (search_key != "") {

        let url = `http://localhost:3000/file/search_files/${search_key}/${user.userId}`
        const fetchData  = {
            method: 'get'
        }
        fetch(url, fetchData)
            .then(resp => {
                if(resp.ok) {
                    return resp.json()
                } else {
                    return Promise.reject("Oops!!! Something went wrong.")
                }
            })
            .then(data => {
                if(data.file.lenght >= 1) {
                    container.classList.toggle("hide")
                    console.log(data)
                    let sn = 1
                    for (file of data.file) {
                       let time = file.time_created.slice(0, 5)
                       let tr = document.createElement("tr")
                       tr.innerHTML =  `
                       <td>${sn++}</td  >
                       <td>${file.file_name}</td>
                       <td>${file.date_created +" "+ time}</td>
                       <td>${file.file_type}</td>
                       <td>${data.user.name}</td>
                       <td> 
                           <button onclick="preview_file('${file.file_name}')" class="btn btn-success"><i class="fa fa-eye"></i></button>
                           <button onclick="delete_file('${file.file_name}')" class="btn btn-danger"><i class="fa fa-trash"></i></button>
                           <button onclick="download_file('${file.file_name}')" class="btn btn-dark"><i class="fa fa-download"></i></button>
                       </td>`
       
                       container.append(tr)
                   }
               } else {
                    // search_container.classList.toggle("hide")
                    container.classList.toggle("hide")
                    // fetch_files()
               }
            })
            .catch(error => {
                console.log(error)
            })
    }
 }


//UPLOAD FILE
function upload_file () {
    let user = JSON.parse(localStorage.getItem("user"))
    // let file = fileInput.files
    let url = `http://localhost:3000/file/file_upload`

    var data = new FormData()
    for (const file of fileInput.files) {
        data.append('files',file,file.name)
      }
    data.append('user', user.userId)

    // // Check for the various File API support.
    // if (window.File && window.FileReader && window.FileList && window.Blob) {
    // alert("Great success! All the File APIs are supported.")  
    // } else {
    // alert('The File APIs are not fully supported in this browser.');
    // }

    const fetchData  = {
        method: 'post',
        body:  data

    }

    fetch(url, fetchData)
        .then(resp => {
            if(resp.ok) {
                return resp.json()
            } else {
                return Promise.reject("Oops!!! Something went wrong.")
            }
        })
        .then(data => {
            alert(data)
            location.reload()            
        })
        .catch(error => {
            console.log(error)
        })
}


//DELETE FILE
function delete_file (file_name) {
    const consent = confirm(`Are you sure you want to delete this file?`)

    if (consent) {
    let url = `http://localhost:3000/file/delete_file`
    
    const fetchData  = {
        method: 'delete',
        body: JSON.stringify({file_name: file_name}),
        headers: {"Content-Type": "application/json"}
    }
    fetch(url, fetchData)
        .then(resp => {
            if(resp.ok) {
                return resp.json()
            } else {
                return Promise.reject("Oops!!! Something went wrong.")
            }
        })
        .then(data => {
            alert(data)
            location.reload()            
            console.log(data)        
        })
        .catch(error => {
            console.log(error)
        })
    } else {

    }
    

}



function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li> <strong>', escape(f.name), '</strong>', '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

//DOWNLOAD FILE
function download_file (file_name) {
    window.open(`http://localhost:3000/file/download/${file_name}`)
}

//PREVIEW FILE
function preview_file(file_name) {
    let preview_modal = document.querySelector(".preview-modal")
    let image_holder = document.querySelector("#image-holder")

    let url = `http://localhost:3000/file/preview_file/${file_name}`
    
    const fetchData  = {
        method: 'get',
    }

    fetch(url, fetchData)
        .then(resp => {
            if(resp.ok) {
                return resp.json()
            } else {
                return Promise.reject("Oops!!! Something went wrong.")
            }
        })
        .then(data => {
            console.log(data)
            preview_modal.classList.toggle("open")
            image_holder.setAttribute("src", data.path)
        })
        .catch(error => {
            console.log(error)
        })
}

//USER LOGIN
const userLogin = () => {
    let email = document.querySelector("#email").value
    let password = document.querySelector("#pass").value
    let login = document.querySelector("#login")

    if(!(email === "" || password  === "")) {
        login.innerHTML = `<img src="images/processing.gif" alt="" >`
        login.style.backgroundColor = "grey"

        let url = `${base_url}user/login`
        let data = {
            email: email,
            password: password
        }
        
        let regReq = {
            method: "post",
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        }

        fetch(url, regReq)
        .then(resp => {
            if(resp.ok) {
                return resp.json()
            } else {
                return Promise.reject("Oops! Something went wrong.")
            }
        })
        .then(data => {
            login.innerHTML = `Log In`
            login.style.backgroundColor = "purple"
            localStorage.clear()
            localStorage.setItem('user', JSON.stringify(data))    
            self.location = "home.html"
        })
        .catch(error => {
            login.innerHTML = `Log In`
            login.style.backgroundColor = "purple"
            alert(error)
        })
    } else {
        alert("Please provide your email and password")
    }
}

//REGISTER USER
const registerUser = () => {
    let name = document.querySelector("#name").value
    let email = document.querySelector("#regEmail").value
    let password = document.querySelector("#regPass").value
    let passConfirm = document.querySelector("#passConfirm").value
    let submit = document.querySelector("#reg")

    if(!(email === "" || password === "" || name === "")) {
        console.log({"pass": password, "confirm": passConfirm})
        if (password === passConfirm) {
            submit.innerHTML = `<img src="images/processing.gif" alt="" >`
            submit.style.backgroundColor = "grey"

            let url = `${base_url}user/register`

            let data = {
                name: name,
                email: email,
                password: password
            }
            let regReq = {
                method: "post",
                body: JSON.stringify(data),
                headers: {"Content-Type": "application/json"}
            }
    
            fetch(url, regReq)
            .then(resp => {
                if(resp.ok) {
                    return resp.json()
                } else {
                    return Promise.reject("Oops... An error occured. Please try again")
                }
            })
            .then(data => {
                if (data === "Success") {
                    submit.innerHTML = `Register`
                    submit.style.backgroundColor = "purple"
                    alert("Registration Successful, proceed to login")
                    self.location = "login.html"
                } else {
                    submit.innerHTML = `Register`
                    submit.style.backgroundColor = "purple"
                    alert(data)
                }
            })
            .catch(error => {
                submit.innerHTML = `Register`
                submit.style.backgroundColor = "purple"
                alert(error)
            })
        } else {
            alert("Password fields does not match")
        }
    } else {
        alert("Please fill out  all the fields")
    }
}

//LOGOUT FUNCTION
const logout = () => {
    localStorage.setItem("links", JSON.stringify("empty"))
    localStorage.setItem("user", JSON.stringify("empty"))
    location = "index.html" 
}