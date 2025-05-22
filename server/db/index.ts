import * as folders from './foldersAccess';
import * as files from './filesAccess';
import * as users from './usersAccess';

export default { ...users, ...files, ...folders };
