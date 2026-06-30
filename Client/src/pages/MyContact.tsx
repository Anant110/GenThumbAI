const MyContact = () => {
  return (
    <div>
     <section className="py-20 px-6 bg-black text-white">
  <div className="max-w-6xl mx-auto">
    
    <div className="text-center mb-12">
      <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
        Have questions, feedback, or need support? We'd love to hear from you.
        Reach out and we'll get back to you as soon as possible.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-12">
      
      {/* Contact Info */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 mr-3">
          Get In Touch
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-blue-500 font-medium">Email</h3>
            <p className="text-gray-400">
              anant.abes459@gmail.com
            </p>
          </div>

          <div>
            <h3 className="text-blue-500 font-medium">Business Inquiries</h3>
            <p className="text-gray-400">
              business@genthumbai.com
            </p>
          </div>

          <div>
            <h3 className="text-blue-500 font-medium">Working Hours</h3>
            <p className="text-gray-400">
              Monday - Friday, 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <form className="space-y-5 bg-gray-900 p-8 rounded-2xl border border-gray-800">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:outline-none"
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:outline-none"
        />

        <input
          type="text"
          placeholder="Subject"
          className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:outline-none"
        />

        <textarea
          rows={5}
          placeholder="Your Message"
          className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:outline-none"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition"
        >
          Send Message
        </button>
      </form>

    </div>
  </div>
</section>
    </div>
  )
}

export default MyContact
