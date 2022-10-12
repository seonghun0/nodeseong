import React from 'react'

function NavBar() {
  return (
    <div>
    <div style={{display:'flex', justifyContent:'space-between'}}>
      <div>
        <a href='/'>Home</a>
      </div>
      <div>
        <a href='/subscription'>Subscription</a>
      </div>
      <div style={{width:'50%'}}></div>
    </div>
    <hr/>
    </div>
  )
}

export default NavBar