console.log("hi")
const modalbtns = [...document.getElementsByClassName('modal-button')]
// console.log(modalbtns)
const url = window.location.href
const startbtn = document.getElementById('start-btn')
const modalbody = document.getElementById('model-body-confirm')
modalbtns.forEach(modalbtn=> modalbtn.addEventListener('click',()=>{
    console.log(modalbtn)
    const pk = modalbtn.getAttribute('data-pk')
    const name = modalbtn.getAttribute('data-name')
    const topic = modalbtn.getAttribute('data-topic')
    const question = modalbtn.getAttribute('data-question')
    const time = modalbtn.getAttribute('data-time')
    const pass = modalbtn.getAttribute('data-pass')

modalbody.innerHTML =`
<div class ="h5 mb-3"> Are you sure to start "<b>${name}</b>"
<div class ="h6 mb-3"> The Topic is "<b>${topic}</b>"
<div class ="text-muted">
    <ul class="mt-3 px-5">
        <li>Name of Quiz : <b>${name}</b></li>
        <li>Topic of Quiz : <b>${topic}</b></li>
        <li>No of Questions : <b>${question}</b></li>
        <li>Time for Quiz : <b>${time}min</b></li>
        <li>Required score to pass Quiz : <b>${pass}%</b></li>
    </ul>
        
`
startbtn.addEventListener('click',()=>{
window.location.href = url + pk
})
}))



