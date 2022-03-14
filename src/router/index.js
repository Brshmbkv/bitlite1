import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'

import ComponentLoadingPlaceholder from '@/components/ComponentLoadingPlaceholder'
import CoursesCrumbs from '@/components/Courses/Crumbs.vue'
import QuestionnaireNew from '@/components/Questionnaire/QuestionnaireNew'
import EnrolPage from '@/views/enrol/course_id'
import Forbidden from '@/views/static/403'
import NotFound from '@/views/static/404'
import Home from '@/views/Home.vue'
import Login from '@/views/Login';
// import LoginNew from '@/views/LoginNew'
import ResetPassword from '@/views/ResetPassword'
import ProfileSettings from '@/views/user/ProfileSettings'

// ADMIN PAGES
const AdminRoot = () => ({
  component: import(/* webpackChunkName: "admin-pages" */ '@/views/admin/root'),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminUsersIndex = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/user/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminStudentShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/user/student/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminStudentCourseShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/user/student/course/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminTeacherShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/user/teacher/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminAdminShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/user/admin/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminCoursesIndex = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/course/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminCourseShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/course/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminModuleShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/course/module/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminChapterShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/course/chapter/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminLessonShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/course/lesson/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminLessonNew = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/course/lesson/new'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminTestIndex = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/course/test/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminTestShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/course/test/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminFinanceIndex = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/finance/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminPurchaseIndex = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/purchase/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminStreamIndex = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/stream/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminStreamShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/stream/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminStreamNew = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/stream/new'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminStreamGroupShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/stream/group/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminStreamModuleShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/stream/module/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminGuidelinesIndex = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/guidelines/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const AdminTagsIndex = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/guidelines/tags/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const CourseFinanceShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/finance/course/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const FinanceCashBoxShow = () => ({
  component: import(
    /* webpackChunkName: "admin-pages" */ '@/views/admin/finance/cashbox/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})

// COURSE PAGES
const CoursesIndex = () => ({
  component: import(
    /* webpackChunkName: "course-pages" */ '@/views/courses/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const CoursesShow = () => ({
  component: import(
    /* webpackChunkName: "course-pages" */ '@/views/courses/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const CoursesCatalogIndex = () => ({
  component: import(
    /* webpackChunkName: "course-pages" */ '@/views/courses/catalog/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const CoursesCatalogFreeIndex = () => ({
  component: import(
    /* webpackChunkName: "course-pages" */ '@/views/courses/catalog/free/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const CoursesCatalogShow = () => ({
  component: import(
    /* webpackChunkName: "course-pages" */ '@/views/courses/catalog/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
// GUIDELINES
const TeacherGuidelinesIndex = () => ({
  component: import(
    /* webpackChunkName: "course-pages" */ '@/views/teacher/guidelines/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})

// STATIC PAGES
const Contacts = () => ({
  component: import(
    /* webpackChunkName: "static-pages" */ '@/views/static/Contacts'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const Terms = () => ({
  component: import(
    /* webpackChunkName: "static-pages" */ '@/views/static/Terms'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})

// TEACHER PAGES
const TeacherRoot = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/root'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const TeacherStreamIndex = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/stream/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const TeacherStreamShow = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/stream/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const StreamLecturesIndex = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/stream/lectures/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const LectorsEvent = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/stream/lectures/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const TeacherGroupStudentShow = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/group/student/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const TeacherStreamStudentShow = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/stream/student/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const TeacherStreamStudentChapterShow = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/stream/student/chapter/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const StreamPracticeIndex = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/stream/practice/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const StreamPracticeShow = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/stream/practice/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const StreamExerciseShow = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/stream/exercise/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const GroupEventIndex = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/group/event/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const GroupEventShow = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/group/event/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const GroupExerciseShow = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/exercises/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const StudentEventPractice = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/group/student/practice/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})

// TEACHER EXERCISES FOR CHECK
const TeacherExercisesIndex = () => ({
  component: import(
    /* webpackChunkName: "teacher-pages" */ '@/views/teacher/exercises/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})

// USER PAGES
const LessonShow = () => ({
  component: import(/* webpackChunkName: "user-pages" */ '@/views/lesson/show'),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const ChapterShow = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/chapter/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const GameShow = () => ({
  component: import(/* webpackChunkName: "user-pages" */ '@/views/game/show'),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const ChapterTestShow = () => ({
  component: import(/* webpackChunkName: "user-pages" */ '@/views/test/index'),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const Test = () => ({
  component: import(/* webpackChunkName: "user-pages" */ '@/views/test/show'),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const LessonTestShow = () => ({
  component: import(/* webpackChunkName: "user-pages" */ '@/views/test/index'),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const Payments = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/user/Payments'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const Guidelines = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/user/Guidelines'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const Profile = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/user/Profile'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const TeacherProfile = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/teacher/Profile'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})

// STUDENT EXERCISES
const ExercisesIndex = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/exercises/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
//STUDENT PRACTICES
const ExercisePracticesIndex = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/exercises/practice/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const ExerciseShow = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/exercises/lesson_id'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})

// Students Rating
const StudentsRatingIndex = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/courses/rating/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})

//COURSE PURCHASE
const PurchaseIndex = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/purchase/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})

//TRAINING
const TrainingCoursesIndex = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/training/course/index'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const TrainingCoursesShow = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/training/course/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const TrainingCoursesTestShow = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/training/course/test/show'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})
const PurchasePaymentShow = () => ({
  component: import(
    /* webpackChunkName: "user-pages" */ '@/views/PurchasePayment'
  ),
  loading: ComponentLoadingPlaceholder,
  delay: 100,
})

Vue.use(VueRouter)

const routes = [
  {
    path: '/reset-password/:id',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/courses',
    name: 'CoursesIndex',
    components: {
      default: CoursesIndex,
      crumbs: CoursesCrumbs,
    },
    // props: route => ({ query: route.query.q }),
    meta: {
      appBarShow: true,
      permit: 2,
      requiresAuth: true,
      title: 'Мои курсы',
    },
  },
  //CATALOG
  {
    path: '/catalog',
    name: 'CoursesCatalogIndex',
    components: {
      default: CoursesCatalogIndex,
    },
    // props: route => ({ query: route.query.q }),
    meta: {
      // remove appBarShow
      permit: 2,
      requiresAuth: true,
      title: 'Каталог курсов',
      backgroundColor: '#F5F6F8',
    },
  },
  {
    path: '/catalog/free',
    name: 'CoursesCatalogFreeIndex',
    components: {
      default: CoursesCatalogFreeIndex,
      crumbs: CoursesCrumbs,
    },
    meta: {
      permit: 2,
      requiresAuth: true,
      title: 'Бесплатные мини-курсы',
      backgroundColor: '#F5F6F8',
    },
  },
  {
    path: '/catalog/:course_id',
    name: 'CoursesCatalogShow',
    components: {
      default: CoursesCatalogShow,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    // props: route => ({ query: route.query.q }),
    meta: {
      appBarShow: true,
      permit: 2,
      requiresAuth: true,
      showHH: true,
    },
  },
  {
    path: '/purchase/:module_id',
    name: 'PurchaseIndex',
    components: {
      default: PurchaseIndex,
    },
    props: {
      default: true,
    },
    // props: route => ({ query: route.query.q }),
    meta: {
      permit: 2,
      requiresAuth: true,
      isEmptyLayout: true,
    },
  },

  {
    path: '/exercises',
    name: 'ExercisesIndex',
    components: {
      default: ExercisesIndex,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      permit: 2,
      requiresAuth: true,
      appBarShow: true,
      title: 'Мои задания',
    },
  },
  {
    path: '/exercises/practice/:event_id',
    name: 'ExercisePracticesIndex',
    components: {
      default: ExercisePracticesIndex,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      permit: 2,
      requiresAuth: true,
      appBarShow: true,
      title: 'Мои задания',
    },
  },
  {
    path: '/exercises/:event_id/event/:exercise_id',
    name: 'EventExerciseShow',
    components: {
      default: ExerciseShow,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      permit: 2,
      requiresAuth: true,
      appBarShow: true,
      title: 'Мои задания',
    },
  },
  // {
  //   path: '/exercises/:exercise_id/event/:event_id',
  //   name: 'EventExerciseShow',
  //   components: {
  //     default: ExerciseShow,
  //     crumbs: CoursesCrumbs,
  //   },
  //   props: {
  //     default: true,
  //   },
  //   // props: route => ({ query: route.query.q }),
  //   meta: {
  //     permit: 2,
  //     requiresAuth: true,
  //     appBarShow: true,
  //     hideSidePanel: true,
  //   },
  // },

  {
    path: '/exercises/:exercise_id/chapter/:chapter_id',
    name: 'ChapterExerciseShow',
    components: {
      default: ExerciseShow,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    // props: route => ({ query: route.query.q }),
    meta: {
      hideSidePanel: true,
      permit: 2,
      requiresAuth: true,
      appBarShow: true,
    },
  },

  {
    path: '/courses/:course_id',
    name: 'CourseShow',
    components: {
      default: CoursesShow,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      appBarShow: true,
      permit: 2,
      requiresAuth: true,
      showHH: true,
    },
  },
  {
    path: '/courses/:module_id/rating',
    name: 'StudentsRatingIndex',
    components: {
      default: StudentsRatingIndex,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      appBarShow: true,
      requiresAuth: true,
    },
  },
  {
    path: '/lesson/:lesson_id',
    name: 'LessonShow',
    components: {
      default: LessonShow,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      appBarShow: true,
      permit: 2,
      requiresAuth: true,
      hideSidePanel: false,
    },
  },
  {
    path: '/test/:test_id',
    name: 'TestStart',
    components: {
      default: Test,
    },
    props: {
      default: true,
    },
    meta: {
      permit: 2,
      isEmptyLayout: true,
    },
  },
  {
    path: '/lesson/:lesson_id/test/:test_id',
    name: 'LessonTestShow',
    components: {
      default: LessonTestShow,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      appBarShow: true,
      permit: 2,
      requiresAuth: true,
      hideSidePanel: true,
    },
  },
  {
    path: '/chapter/:chapter_id',
    name: 'ChapterShow',
    components: {
      default: ChapterShow,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      appBarShow: true,
      hideSidePanel: true,
      permit: 2,
      requiresAuth: true,
    },
  },
  {
    path: '/chapter/:chapter_id/test/:test_id',
    name: 'ChapterTestShow',
    components: {
      default: ChapterTestShow,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      appBarShow: true,
      permit: 2,
      requiresAuth: true,
      hideSidePanel: true,
    },
  },
  {
    path: '/game/:chapter_id',
    name: 'GameShow',
    components: {
      default: GameShow,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      appBarShow: true,
      permit: 2,
      requiresAuth: true,
      hideSidePanel: true,
    },
  },
  // ]
  // },
  // User
  {
    path: '/u/payments',
    name: 'Payments',
    component: Payments,
    meta: {
      permit: 2,
      requiresAuth: true,
      title: 'История покупок',
    },
  },
  {
    path: '/u/profile',
    name: 'Profile',
    components: {
      default: Profile,
      crumbs: CoursesCrumbs,
    },
    meta: {
      requiresAuth: true,
      title: 'Личный кабинет',
      showCrumbs: true,
      appBarShow: true,
    },
  },
  {
    path: '/u/guidelines',
    name: 'Guidelines',
    components: {
      default: Guidelines,
      crumbs: CoursesCrumbs,
    },
    meta: {
      requiresAuth: true,
      title: 'FAQ',
    },
  },
  {
    path: '/u/profile/settings',
    name: 'ProfileSettings',
    components: {
      default: ProfileSettings,
      crumbs: CoursesCrumbs,
    },
    meta: {
      requiresAuth: true,
      title: 'Настройки',
      showCrumbs: true,
      appBarShow: true,
    },
  },
  // Info
  {
    path: '/i/contacts',
    name: 'Contacts',
    component: Contacts,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/i/terms',
    name: 'Terms',
    component: Terms,
    meta: {
      requiresAuth: true,
    },
  },
  // TEACHER
  {
    path: '/t',
    name: 'TeacherRoot',
    components: {
      default: TeacherRoot,
      crumbs: CoursesCrumbs,
    },
    meta: {
      requiresAuth: true,
      permit: 3,
    },
    children: [
      {
        path: 'profile',
        name: 'TeacherProfile',
        components: {
          default: TeacherProfile,
          crumbs: CoursesCrumbs,
        },
        meta: {
          requiresAuth: true,
          title: 'Личный кабинет',
          showCrumbs: true,
          appBarShow: true,
        },
      },
      {
        path: 'profile/settings',
        name: 'TeacherProfileSettings',
        components: {
          default: ProfileSettings,
          crumbs: CoursesCrumbs,
        },
        meta: {
          requiresAuth: true,
          title: 'Настройки',
          showCrumbs: true,
          appBarShow: true,
        },
      },
      {
        path: 'stream',
        name: 'Streams',
        component: TeacherStreamIndex,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'stream/:stream_id',
        name: 'StreamShow',
        component: TeacherStreamShow,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'stream/:stream_id/g/:group_id',
        name: 'StreamGroupIndex',
        component: TeacherStreamShow,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      // {
      //   path: "/t/student/:student_id",
      //   name: "StreamGroupIndex",
      //   component: TeacherStreamShow,
      //   props: true,
      //   meta: {
      //     requiresAuth: true,
      //     permit: 3,
      //   },
      // },
      {
        path: 'stream/:stream_id/lectures',
        name: 'StreamLecturesIndex',
        component: StreamLecturesIndex,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'stream/:stream_id/practices',
        name: 'StreamPracticeIndex',
        component: StreamPracticeIndex,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'stream/:stream_id/practices/:practice_id',
        name: 'StreamPracticeShow',
        component: StreamPracticeShow,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'stream/:group_id/exercise/:exercise_id',
        name: 'StreamExerciseShow',
        component: StreamExerciseShow,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      //GUIDELINES
      {
        path: 'guidelines',
        name: 'TeacherGuidelinesIndex',
        component: TeacherGuidelinesIndex,
        meta: {
          permit: 3,
          requiresAuth: true,
          title: 'FAQ',
        },
      },
      {
        path: '/lector/event/:event_id',
        name: 'StreamLectureShow',
        component: LectorsEvent,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'group/:group_id/student/:student_id',
        name: 'TeacherGroupStudentShow',
        component: TeacherGroupStudentShow,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'stream/:stream_id/student/:student_id',
        name: 'TeacherStreamStudentShow',
        component: TeacherStreamStudentShow,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'stream/:group_id/student/:student_id/chapter/:chapter_id',
        name: 'TeacherStreamStudentChapterShow',
        component: TeacherStreamStudentChapterShow,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'student/:student_id/e/:event_id/exercises',
        name: 'StudentEventPractice',
        component: StudentEventPractice,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'group/:group_id/events',
        name: 'GroupEventIndex',
        component: GroupEventIndex,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'group/:group_id/events/:event_id',
        name: 'GroupEventShow',
        component: GroupEventShow,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'exercises',
        name: 'TeacherExercisesIndex',
        component: TeacherExercisesIndex,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
      {
        path: 'exercises/:event_id/exercise/:exercise_id',
        name: 'GroupExerciseShow',
        component: GroupExerciseShow,
        props: true,
        meta: {
          appBarShow: true,
          requiresAuth: true,
          permit: 3,
        },
      },
    ],
  },

  // ADMIN
  {
    path: '/a',
    name: 'AdminRoot',
    components: {
      default: AdminRoot,
    },
    meta: {
      requiresAuth: true,
      permit: 1,
    },
    children: [
      {
        path: 'users',
        name: 'AdminUsersIndex',
        component: AdminUsersIndex,
        props: true,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'student/:user_id',
        name: 'AdminStudentShow',
        component: AdminStudentShow,
        props: true,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'student/:user_id/course/:course_id',
        name: 'AdminStudentCourseShow',
        component: AdminStudentCourseShow,
        props: true,
        meta: {
          showCrumbs: true,
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'teacher/:user_id',
        name: 'AdminTeacherShow',
        component: AdminTeacherShow,
        props: true,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'admin/:user_id',
        name: 'AdminAdminShow',
        component: AdminAdminShow,
        props: true,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'courses',
        name: 'AdminCoursesIndex',
        component: AdminCoursesIndex,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'courses/:course_id',
        name: 'AdminCourseShow',
        component: AdminCourseShow,
        props: true,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'modules/:module_id',
        name: 'AdminModuleShow',
        component: AdminModuleShow,
        props: true,
        meta: {
          requiresAuth: true,
          showCrumbs: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'chapters/:chapter_id',
        name: 'AdminChapterShow',
        component: AdminChapterShow,
        props: true,
        meta: {
          requiresAuth: true,
          showCrumbs: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'chapters/:chapter_id/tests',
        name: 'AdminTestIndex',
        component: AdminTestIndex,
        props: true,
        meta: {
          requiresAuth: true,
          showCrumbs: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'tests/:test_id',
        name: 'AdminTestShow',
        component: AdminTestShow,
        props: true,
        meta: {
          requiresAuth: true,
          showCrumbs: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'chapters/:chapter_id/lessons/:lesson_id',
        name: 'AdminLessonShow',
        component: AdminLessonShow,
        props: true,
        meta: {
          requiresAuth: true,
          showCrumbs: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'chapters/:chapter_id/lesson/new',
        name: 'AdminLessonNew',
        component: AdminLessonNew,
        props: true,
        meta: {
          requiresAuth: true,
          showCrumbs: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'finance',
        name: 'AdminFinanceIndex',
        component: AdminFinanceIndex,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'courses/:course_id/finance',
        name: 'CourseFinanceShow',
        component: CourseFinanceShow,
        props: true,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          showCrumbs: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'finance/cashbox/:cb_id',
        name: 'FinanceCashBoxShow',
        component: FinanceCashBoxShow,
        props: true,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'purchases',
        name: 'AdminPurchaseIndex',
        component: AdminPurchaseIndex,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'streams',
        name: 'AdminStreamIndex',
        component: AdminStreamIndex,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'streams/new',
        name: 'AdminStreamNew',
        component: AdminStreamNew,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'streams/:stream_id',
        name: 'AdminStreamShow',
        component: AdminStreamShow,
        props: true,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'streams/:stream_id/groups/:group_id',
        name: 'AdminStreamGroupShow',
        component: AdminStreamGroupShow,
        props: true,
        meta: {
          requiresAuth: true,
          showCrumbs: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'streams/:stream_id/modules/:module_id',
        name: 'AdminStreamModuleShow',
        component: AdminStreamModuleShow,
        props: true,
        meta: {
          requiresAuth: true,
          showCrumbs: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'guidelines',
        name: 'AdminGuidelinesIndex',
        component: AdminGuidelinesIndex,
        props: true,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
      {
        path: 'guidelines/tags',
        name: 'AdminTagsIndex',
        component: AdminTagsIndex,
        props: true,
        meta: {
          requiresAuth: true,
          appBarShow: true,
          backgroundColor: '#F5F6F8',
        },
      },
    ],
  },

  // TRAINING
  {
    path: '/training/courses',
    name: 'TrainingCoursesIndex',
    component: TrainingCoursesIndex,
    meta: {
      permit: 2,
      requiresAuth: true,
    },
  },
  {
    path: '/training/courses/:course_id',
    name: 'TrainingCoursesShow',
    components: {
      default: TrainingCoursesShow,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      permit: 2,
      appBarShow: true,
      requiresAuth: true,
    },
  },
  {
    path: '/training/test/:test_id',
    name: 'TrainingCoursesTestShow',
    components: {
      default: TrainingCoursesTestShow,
      crumbs: CoursesCrumbs,
    },
    props: {
      default: true,
    },
    meta: {
      permit: 2,
      appBarShow: true,
      requiresAuth: true,
    },
  },

  // OTHER
  {
    path: '/questionnaire',
    name: 'Questionnaire',
    component: QuestionnaireNew,
    meta: {
      isEmptyLayout: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    props: (route) => ({ ...route.query, ...route.params }),
    meta: {
      guest: true,
    },
  },
  {
    path: '/enrol/:course_id',
    name: 'EnrolPage',
    component: EnrolPage,
    props: (route) => ({ ...route.query, ...route.params }),
    meta: {
      isEmptyLayout: true,
    },
  },
  {
    path: '/purchase_payment/:purchase_id',
    name: 'Purchase',
    component: PurchasePaymentShow,
    meta: {
      isEmptyLayout: true,
    },
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      requiresAuth: true,
      isEmptyLayout: true,
    },
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: {
      requiresAuth: true,
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = to?.meta?.title || 'project'
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !localStorage.getItem('token') &&
    to.name !== 'Login'
  ) {
    // trigger 'logout' action, sice layout wont change w/o it
    store.dispatch('user/logout')
    next({
      path: '/login',
      params: { nextUrl: to.fullPath },
    })
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (!localStorage.getItem('token')) next()
    else next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
