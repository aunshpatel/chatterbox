export default function DeleteProfileInstructions() {
  return (
    <main className="min-h-screen bg-gray-100 pb-20">
      <div className="flex flex-col items-center p-4 sm:p-6 lg:p-10">
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 w-full max-w-4xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Instructions to Delete Profile
          </h1>

          <h2 className="text-base sm:text-lg font-bold mb-2">
            1. From Chatterbox Mobile Application:
          </h2>
          <p className="text-sm sm:text-base mb-1">
            In order to delete your profile from Chatterbox Mobile Application, please follow the steps given below:
          </p>
          <p className="text-sm sm:text-base mb-6 leading-relaxed">
            i. Open the "Chatterbox" mobile application.
            <br />
            ii. If you have not logged in, please login.
            <br />
            iii. Go to "My Profile".
            <br />
            iv. Press "Delete" button and confirm your choices.
          </p>

          {/* <h2 className="text-base sm:text-lg font-bold mb-2">
            2. From Chatterbox Website:
          </h2>
          <p className="text-sm sm:text-base mb-1">
            In order to delete your profile from the Chatterbox Website, please follow the steps given below:
          </p>
          <p className="text-sm sm:text-base mb-6 leading-relaxed">
            i. Open "Chatterbox" website:{' '}
            <a className="underline cursor-pointer text-blue-600" href="https://the-todo-list.onrender.com/" target="_blank" rel="noopener noreferrer">
              https://the-todo-list.onrender.com/
            </a>.
            <br />
            ii. If you have not logged in, please login.
            <br />
            iii. Go to "Profile".
            <br />
            iv. Press "Delete Account" and confirm your choices.
          </p> */}

          <h1 className="text-lg sm:text-xl font-bold mb-4">
            Types Of Data That Will Be Permanently Deleted:
          </h1>
          <p className="text-sm sm:text-base mb-6 leading-relaxed">
            i. Full Name
            <br />
            ii. Phone Number
            <br />
            iii. Profile Photo
          </p>

          <h1 className="text-lg sm:text-xl font-bold mb-4">
            Types Of Data That We Will Retain:
          </h1>
          <p className="text-sm sm:text-base mb-6 leading-relaxed">
            i. All Chats
            <br />
            ii. All Photos (sent and/or received)
            <br />
            iii. All Videos (sent and/or received)
          </p>

          <h2 className="text-lg sm:text-xl font-bold mb-2">PLEASE NOTE:</h2>
          <h3 className="text-sm sm:text-base font-semibold mb-4">
            We keep data as long as user has an account. <span className="underline">Once the account is deleted, only your profile data is deleted</span>.
          </h3>
        </div>
      </div>
    </main>
  );
}