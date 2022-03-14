// Redircts user to 'Home' route
// if permit exists on route
// and users role permision doesnt corespond
const roleGuard = function(to, from, next){
  next( vm => {
    console.log(to.matched.some(record => record?.meta?.permit 
      && (record.meta.permit !== vm.$store.getters['user/role_id']) 
      && (vm.$store.getters['user/role_id'] >= 0)
    ));
    if(to.matched.some(record => record?.meta?.permit 
      && (record.meta.permit !== vm.$store.getters['user/role_id']) 
      && (vm.$store.getters['user/role_id'] >= 0)
    )){
      console.error('guard permition Error:', vm.$store.getters['user/role_id'])
      next({
        name: 'Home'
      });
    }
  });
}

export { roleGuard };