import { Footer } from "flowbite-react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import React from "react";

const FooterComp = () => {
  return (
    <Footer container className="border border-t-8 dark:bg-black">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-3">
          <div>
            <Footer.Brand
              href="#"
              src="./logo.png"
              alt="Logo"
              name="Project management Tool"
            />
          </div>
          <div className="grid grid-cols-3 gap-8 sm:mt-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="Frontend Libraries" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://flowbite.com/" target="_blank">
                  Flowbite
                </Footer.Link>
                <Footer.Link href="https://tailwindcss.com/" target="_blank">
                  Tailwind CSS
                </Footer.Link>
                <Footer.Link href="https://reactjs.org/" target="_blank">
                  React
                </Footer.Link>
                <Footer.Link href="https://redux.js.org/" target="_blank">
                  Redux
                </Footer.Link>
                <Footer.Link href="https://firebase.google.com/" target="_blank">
                  Firebase
                </Footer.Link>
                <Footer.Link href="https://ant.design/" target="_blank">
                  Ant Design
                </Footer.Link>
                <Footer.Link href="https://www.npmjs.com/package/react-beautiful-dnd" target="_blank">
                  React Beautiful DnD
                </Footer.Link>
                <Footer.Link href="https://www.npmjs.com/package/react-big-calendar" target="_blank">
                  React Big Calendar
                </Footer.Link>
                <Footer.Link href="https://www.npmjs.com/package/jspdf" target="_blank">
                  jsPDF
                </Footer.Link>
                <Footer.Link href="https://react-icons.github.io/react-icons/" target="_blank">
                  React Icons
                </Footer.Link>
                <Footer.Link href="https://reactrouter.com/" target="_blank">
                  React Router DOM
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Frontend Packages" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://www.npmjs.com/package/axios" target="_blank">
                  Axios
                </Footer.Link>
                <Footer.Link href="https://www.npmjs.com/package/file-saver" target="_blank">
                  File Saver
                </Footer.Link>
                <Footer.Link href="https://www.npmjs.com/package/react-circular-progressbar" target="_blank">
                  React Circular Progressbar
                </Footer.Link>
                <Footer.Link href="https://www.npmjs.com/package/react-csv" target="_blank">
                  React CSV
                </Footer.Link>
                <Footer.Link href="https://www.npmjs.com/package/react-toastify" target="_blank">
                  React Toastify
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Backend Packages" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://www.npmjs.com/package/bcryptjs" target="_blank">
                  bcryptjs
                </Footer.Link>
                <Footer.Link href="https://expressjs.com/" target="_blank">
                  Express
                </Footer.Link>
                <Footer.Link href="https://mongoosejs.com/" target="_blank">
                  Mongoose
                </Footer.Link>
                <Footer.Link href="https://www.npmjs.com/package/cors" target="_blank">
                  Cors
                </Footer.Link>
                <Footer.Link href="https://www.npmjs.com/package/jsonwebtoken" target="_blank">
                  JWT
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between font-bold">
          <Footer.Copyright
            href="#"
            by="Praveen™"
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon
              href="https://github.com/Hawkpraveen"
              icon={BsGithub}
            />
            <Footer.Icon
              href="https://www.linkedin.com/in/praveen-kumar-496255190/"
              icon={BsLinkedin}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComp;
