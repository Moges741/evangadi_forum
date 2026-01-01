import React from 'react'

const Register = () => {
  return (
    <section>
        <form action="">
<div>
    <span>username : </span>
    <input type="text" placeholder='username' />
</div>
<br />
<div>
    <span>First Name : </span>
    <input type="text" placeholder='first name'/>
</div>
<br />
<div>
    <span>Last Name : </span>
    <input type="text" placeholder='last name'/>
</div>
<br />
<div>
    <span>Email : </span>
    <input type="email" placeholder='email'/>
</div>
<br />
<div>
    <span>Password : </span>
    <input type="password" placeholder='password'/>
</div>

<button type='submit'>Register</button>
        </form>
      
    </section>
  );
}

export default Register
