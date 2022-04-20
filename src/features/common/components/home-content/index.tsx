import * as React from 'react';
import { useHistory } from 'react-router';
import { useTypedSelector } from 'features/common/hooks';
import { OcButtonComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';

import AppIcon from '../../../../../public/assets/img/app-icon.svg';
import AppIcon1 from '../../../../../public/assets/img/app-icon1.svg';
import IconPlaceholder from '../../../../../public/assets/img/icon-placeholder.svg';
import IconPlaceholder2 from '../../../../../public/assets/img/icon-placeholder2.svg';
import ArrowRight from '../../../../../public/assets/img/arrow-right.svg';
import AppIcon3 from '../../../../../public/assets/img/app-icon3.svg';
import TemporaryHomePic from '../../../../../public/assets/img/temporary_home_pic.png';

import './style.scss';

export const HomeContent = () => {
  const history = useHistory();
  const { home } = useTypedSelector(({ cmsContent }) => cmsContent);

  const handleClick = () => {
    history.push(home?.bottomCalloutButtonLocation || '/');
  };
  return (
    <>
      <div className="home__hero bg-container min-height-auto">
        <div className="container d-flex flex-column align-items-center justify-content-center">
          <h1 className="home__hero-title text-center">{home?.pageInfoTitle}</h1>
          <p className="home__hero-description text-secondary text-center">
            {home?.pageInfoSubtext}
          </p>
          <div className="home__hero-partner">
            <OcButtonComponent onClick={handleClick} text="Become a partner" />
          </div>
        </div>
      </div>
      <div className="home__services container d-flex justify-content-between flex-column flex-md-row">
        <section className="home__services-intro col-md-5">
          <h2 className="home__services-title">Why list on the OpenChannel Marketplace?</h2>
          <p className="home__services-description text-secondary">
            Build traction for your open source project or software company by listing your 1-Click
            Application in the Open Channel Marketplace.
          </p>
          <img
            className="home__services-image img-fluid article-image"
            src={TemporaryHomePic}
            alt="home pic"
          />
        </section>
        <div className="home__services-list col-md-5">
          <div className="home__services-card feature-card">
            <div className="row mx-0 align-items-center flex-nowrap">
              <div className="feature-icon">
                <img src={AppIcon1} alt="icon" />
              </div>
              <h3 className="home__services-card-title ml-2 mb-0">Reach more users</h3>
            </div>
            <p className="home__services-card-description text-secondary mt-2 mb-0">
              Open Channel global community of 4 million developers relies heavily on open source
              and free software when getting started. The Open Channel Marketplace helps them easily
              find and launch your project or product.
            </p>
          </div>
          <div className="home__services-card feature-card">
            <div className="row mx-0 align-items-center flex-nowrap">
              <div className="feature-icon">
                <img src={IconPlaceholder} alt="icon" />
              </div>
              <h3 className="home__services-card-title ml-2 mb-0">Create new revenue streams</h3>
            </div>
            <p className="home__services-card-description text-secondary mt-2 mb-0">
              You can sell licenses directly to users now and, we plan to make new billing options
              available to help you create new and easier revenue streams for your business or
              projects.
            </p>
          </div>
          <div className="home__services-card feature-card">
            <div className="row mx-0 align-items-center flex-nowrap">
              <div className="feature-icon">
                <img src={IconPlaceholder2} alt="icon" />
              </div>
              <h3 className="home__services-card-title ml-2 mb-0">Find new committers</h3>
            </div>
            <p className="home__services-card-description text-secondary mt-2 mb-0">
              Putting your 1-Click App in the DigitalOcean Marketplace introduces your project to
              more developers, which can lead to more people supporting and committing to it down
              the road.
            </p>
          </div>
        </div>
      </div>
      <div className="home__technology bg-container min-height-auto">
        <div className="container d-flex flex-column align-items-center justify-content-center">
          <h2 className="home__technology-title text-center">
            How developers are using the Open Channel
            <br />
            Marketplace?
          </h2>
          <div className="home__technology-list row">
            <div className="home__technology-card">
              <div className="row mx-0 align-items-center">
                <div className="technology-icon">
                  <img src={AppIcon1} alt="icon" />
                </div>
                <p className="font-med ml-2 mb-0">Plesk</p>
              </div>
              <p className="text-secondary mt-2 mb-1 technology-description">
                Plesk&apos;s free 1-Click Application enabled the company to capture thousands of
                new users in record time.
              </p>
              <a href="/" className="cursor-pointer">
                <span className="text-primary font-m font-med pr-1">See case</span>
                <img alt="icon" src={ArrowRight} />
              </a>
            </div>
            <div className="home__technology-card">
              <div className="row mx-0 align-items-center">
                <div className="technology-icon">
                  <img src={AppIcon} alt="icon" />
                </div>
                <p className="font-med ml-2 mb-0">Hasura GraphQL</p>
              </div>
              <p className="text-secondary mt-2 mb-1 technology-description">
                As a new startup, Hasura enjoys greater exposure and faster user adoption for their
                GraphQL engine, which brings blazing fast…
              </p>
              <a href="/" className="cursor-pointer">
                <span className="text-primary font-m font-med pr-1">See case</span>
                <img alt="icon" src={ArrowRight} />
              </a>
            </div>
            <div className="home__technology-card">
              <div className="row mx-0 align-items-center">
                <div className="technology-icon">
                  <img src={AppIcon3} alt="icon" />
                </div>
                <p className="font-med ml-2 mb-0">Zulip</p>
              </div>
              <p className="text-secondary mt-2 mb-1 technology-description">
                Zulip users can get an open source chat server online in just minutes using the Open
                Channel Marketplace.
              </p>
              <a href="/" className="cursor-pointer">
                <span className="text-primary font-m font-med pr-1">See case</span>
                <img alt="icon" src={ArrowRight} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="home__approach container d-flex flex-column">
        <h2 className="home__approach-title row">
          How to list your 1-Click application on the marketplace?
        </h2>
        <div className="row justify-content-between">
          <div className="home__approach-card col-md-5">
            <div className="home__approach-card-heading align-items-center flex-nowrap">
              <span className="list-number">1</span>
              <h3 className="home__approach-card-name">Register to become a Marketplace Vendor</h3>
            </div>
            <p className="home__approach-card-text text-secondary">
              Just click
              <a href="/" className="home__approach-card-link link font-med">
                &nbsp;Become a Seller&nbsp;
              </a>
              and give us a few pieces of information about your 1-Click App idea and your company.
              We&apos;ll respond with next steps or additional questions.
            </p>
          </div>
          <div className="home__approach-card col-md-5">
            <div className="home__approach-card-heading align-items-center flex-nowrap">
              <span className="list-number">2</span>
              <h3 className="home__approach-card-name">Build your image</h3>
            </div>
            <p className="home__approach-card-text text-secondary">
              Quickly and simply build a VM image on Open Channel manually, or automate via Fabric
              and Packer,
              <a href="/" className="home__approach-card-link link font-med">
                &nbsp;then check its quality and readiness with our tools.&nbsp;
              </a>
              Or you can simply build a Kubernetes app with a single
              <a href="/" className="home__approach-card-link link font-med">
                &nbsp;PR on our repo.&nbsp;
              </a>
            </p>
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="home__approach-card col-md-5">
            <div className="home__approach-card-heading align-items-center flex-nowrap">
              <span className="list-number">3</span>
              <h3 className="home__approach-card-name">Give us the details about your listing</h3>
            </div>
            <p className="home__approach-card-text text-secondary">
              Provide the details and your 1-Click Apps on Droplet VMs and Open Channel Kubernetes
              will then be made available to all Open Channel customers once approved. (We plan to
              support listings of SaaS applications soon, too.)
            </p>
          </div>
          <div className="home__approach-card col-md-5">
            <div className="home__approach-card-heading align-items-center flex-nowrap">
              <span className="list-number">4</span>
              <h3 className="home__approach-card-name">Engage with the community</h3>
            </div>
            <p className="home__approach-card-text text-secondary">
              We encourage you to connect with your users by sharing links to forums or other
              support channels within your Marketplace listing. Take advantage of the opportunity to
              hear what your users want out of your product or project. And don&apos;t forget to
              send users to your new 1-Click App listing.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeContent;
