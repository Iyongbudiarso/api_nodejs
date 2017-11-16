const config = [];
// config.local_time = +7;
// config.app_name = 'suzuki_csi';
// config.super_admin_slug =['super-admin'];//,'suzuki'
// config.site_url ='';
// config.port =3017;
config.powered_by = 'maxsolution.net';

config.dbdriver = 'mongodb'; // mongodb, mysql

// bcrypt
config.salt_work_factor = 10;

// use jwt config
config.secret_key = 'ilovethey';
config.jwt_sign_options = { noTimestamp: true };
config.jwt_verify_options = { ignoreExpiration: true };
config.jwt_expire_token = 1440; // in minutes

module.exports = config;
