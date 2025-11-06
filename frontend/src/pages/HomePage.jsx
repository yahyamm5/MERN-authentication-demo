import FloatingShape from '../components/FloatingShape.jsx'

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'
		>
			<FloatingShape  color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0}  />
			<FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

      <a href="http://localhost:5173/signup" className="bottom-80 absolute gap-x-4 rounded-xl text-white bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10" >signup</a>
      <a href="http://localhost:5173/login" className="bottom-40 absolute gap-x-4 rounded-xl text-white bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10" >login</a>
    </div>
  )
}

export default HomePage
