import { useMagicEmailLogin } from '@/features/auth';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const mutationFn = useMagicEmailLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (email) {
      mutationFn.mutate({ email });
    }
  };

  return (
    <div className='bg-gradient-to-r flex from-cyan-500 h-screen items-center justify-center to-blue-500'>
      <form
        onSubmit={handleSubmit}
        className='bg-white flex flex-col gap-4 p-8 rounded-lg shadow-xl w-96'>
        <h1 className='font-bold text-2xl text-center'>Login</h1>
        <input
          className='border-2 border-gray-200 focus:border-blue-500 focus:outline-none p-2 rounded-md transition-colors'
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type='submit'
          className={`p-2 rounded-md text-white ${
            !email || mutationFn.isPending
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600'
          } transition-colors`}
          disabled={!email || mutationFn.isPending}>
          {mutationFn.isPending ? 'Processing...' : 'Login'}
        </button>
        {mutationFn.isError && (
          <p className='text-center text-red-500'>
            Error logging in. Please try again.
          </p>
        )}
        {mutationFn.isSuccess && (
          <p className='text-center text-green-500'>
            Check your email for a login link!
          </p>
        )}
      </form>
    </div>
  );
}
