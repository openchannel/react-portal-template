import { useHistory } from 'react-router-dom';
import { MainTemplate } from 'features/common/templates';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import './styles.scss';

const CreateApp = (): JSX.Element => {
  const history = useHistory();

  return (
    <MainTemplate>
      <div className="bg-container manage-app-header">
        <OcNavigationBreadcrumbs
          pageTitle="Create app"
          navigateText="Back"
          navigateClick={history.goBack}
        />
      </div>
    </MainTemplate>
  );
};

export default CreateApp;
