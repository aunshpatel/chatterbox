import { useForm, ValidationError } from '@formspree/react';

export default function ContactUs() {
    const [state, handleSubmit] = useForm("mvgkzave");
    if (state.succeeded) {
        return <p>Thanks for joining!</p>;
    }
    return (
        <main>
            <div className="p-4 mx-auto flex flex-col items-center">
                <div className="bg-white w-full sm:w-auto max-w-lg shadow-md rounded-lg p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl text-center font-bold mb-4">
                    Contact Us
                </h1>

                <form className="flex flex-col" method="post" encType="multipart/form-data" action="https://formspree.io/f/mvgkzave" >
                    <div className="mb-5">
                    <input id="name" type="text" name="name" placeholder="Your Name" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="mb-5">
                    <input id="email" type="email" name="email" placeholder="Your Email ID" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ValidationError prefix="Email" field="email" errors={state.errors} />
                    </div>

                    <div className="mb-5">
                    <textarea id="message" rows="5" name="message" placeholder="Your Message" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ValidationError prefix="Message" field="message" errors={state.errors} />
                    </div>

                    <button type="submit" className="p-3 mb-5 bg-[rgb(7,57,106)] text-white rounded-lg uppercase w-full hover:opacity-95 disabled:opacity-80 cursor-pointer">
                    Submit
                    </button>
                </form>

                <p className="text-red-500 font-bold w-full max-w-md text-sm sm:text-base">
                    Please note that once you press submit, you will be redirected to a new
                    page. To come back, you will have to press 'Go back'. Alternatively, you
                    can close the tab.
                </p>
                </div>
            </div>
        </main>
    );
}
