const container = document.querySelector("#file_holder")
const search_container = document.querySelector("#search_file_holder")
const fileInput = document.getElementById('files')


const localUrl = `http://localhost:5000`
const herokuUrl = `https://filesrepo.herokuapp.com`
const base_url = localUrl

if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect, false);
}

// document.addEventListener('DOMContentLoaded', () => {
//     
// })


// FETCH URL
const fetch_files = () => {
    let url = `${base_url}/file/fetch_files/`
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
            upload_btn = document.querySelector("#upload")
            upload_btn.value = "Upload"
            container.innerHTML = ""
            let sn = 1
            for (file of data) {

                let begin = file.file_path.indexOf("/upload")
                let url1 = file.file_path.slice(0, begin)
                let url2 = file.file_path.slice(begin + 7, file.file_path.length)
                let download_url = `${url1}/upload/fl_attachment${url2}`
                
                let time = file.time_created.slice(0, 5)
                let tr = document.createElement("tr")
                tr.innerHTML =  `
                <td>${sn++}</td  >
                <td>${file.file_name}</td>
                <td>${file.date_created +" "+ time}</td>
                <td>${file.file_type}</td>
                <td>${file.user.lname + " " + file.user.fname}</td>
                <td> 
                    <a href="${file.file_path}" target="_black" title='Preview File' data-toggle='tooltip' data-placement='top' class="oje btn btn-success"><i class="fa fa-eye"></i></a>
                    <button onclick="delete_file('${file.file_real_name}')" title='Delete File' data-toggle='tooltip' data-placement='top' class="oje btn btn-danger"><i class="fa fa-trash"></i></button>
                    <a href="${download_url}" target="_black" title='Downoad File' data-toggle='tooltip' data-placement='top' class="oje btn btn-dark" download><i class="fa fa-download"></i></a>
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
    let mobile = document.querySelector("#search-input-mobile").value
    let desktop = document.querySelector("#search-input").value
    let search_key
    if (document.documentElement.clientWidth > 750) {
        search_key = desktop
    } else {
        search_key = mobile
    }

    if (search_key != "") {

        let url = `${base_url}/file/search_files/${search_key}`
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
                console.log(data)
                if(data.length >= 1) {
                    document.querySelector(".not-found").style.display = "none"
                    search_container.innerHTML = ""
                    container.innerHTML = ""
                   
                    let sn = 1
                    for (file of data) {
                       let time = file.time_created.slice(0, 5)
                       let tr = document.createElement("tr")
                       tr.innerHTML =  `
                       <td>${sn++}</td  >
                       <td>${file.file_name}</td>
                       <td>${file.date_created +" "+ time}</td>
                       <td>${file.file_type}</td>
                       <td>${file.user.lname + " " + file.user.fname}</td>
                       <td> 
                           <button onclick="preview_file('${file.file_name}')" class="btn btn-success"><i class="fa fa-eye"></i></button>
                           <button onclick="delete_file('${file.file_name}')" class="btn btn-danger"><i class="fa fa-trash"></i></button>
                           <button onclick="download_file('${file.file_name}')" class="btn btn-dark"><i class="fa fa-download"></i></button>
                       </td>`
       
                       search_container.append(tr)
                   }
               } else {
                search_container.innerHTML = ""
                    fetch_files()
                    document.querySelector(".not-found").style.display = "block"
               }
            })
            .catch(error => {
                console.log(error)
            })
    }
 }


//UPLOAD FILE
function upload_file () {
    const upload_btn = document.querySelector("#upload")
    upload_btn.value = "Processing..."
    let user = JSON.parse(localStorage.getItem("user"))
    let url = `${base_url}/file/file_upload`

    let data = new FormData()
    for (const file of fileInput.files) {
        data.append('file', file, file.name)
      }
      console.log(data.get('file'))
    data.append('user', user._id)
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
            document.getElementById('list').innerHTML = ""
            fileInput.value = ""
           if (data = "Upload successful") {
                fetch_files()
            } else {
                upload_btn.value = "Upload"
            }
        })
        .catch(error => {
            console.log(error)
        })
}


//DELETE FILE
function delete_file (file_name) {
    const consent = confirm(`Are you sure you want to delete this file?`)

    if (consent) {
    let url = `${base_url}/file/delete_file`
    
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
            fetch_files()
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

//USER LOGIN
const userLogin = () => {
    let email = document.querySelector("#email").value
    let password = document.querySelector("#pass").value
    let login = document.querySelector("#login")

    if(!(email === "" || password  === "")) {
        login.innerHTML = `<img src="images/processing.gif" alt="" >`
        login.style.backgroundColor = "grey"

        let url = `${base_url}/user/login`
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
            } else if (resp.statusText == "Unauthorized") {
                    throw new Error("Email does not exist or Password is invalid")
            } else {
                return Promise.reject("Oops! something went wrong")
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
    let fname = document.querySelector("#fname").value
    let lname = document.querySelector("#lname").value
    let email = document.querySelector("#regEmail").value
    let password = document.querySelector("#regPass").value
    let passConfirm = document.querySelector("#passConfirm").value
    let submit = document.querySelector("#reg")

    if(!(email === "" || password === "" || lname === "" || fname === "")) {

        if (password === passConfirm) {
            submit.innerHTML = `<img src="images/processing.gif" alt="" >`
            submit.style.backgroundColor = "grey"

            let url = `${base_url}/user/register`

            let data = {
                fname: fname,
                lname: lname,
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
                    self.location = "index.html"
                } else {
                    submit.innerHTML = `Register`
                    submit.style.backgroundColor = "purple"
                    alert(data)
                    self.location = "index.html"
                }
            })
            .catch(error => {
                submit.innerHTML = `Register`
                submit.style.backgroundColor = "purple"
                console.log(error)
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