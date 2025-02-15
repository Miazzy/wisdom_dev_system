<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div class="flex items-center absolute right-4 top-4">
      <AppDarkModeToggle class="enter-x mr-2" v-if="!sessionTimeout" />
    </div>

    <div class="absolute" :class="`${prefixCls}-logo`"></div>

    <div class="container relative h-full py-2 mx-auto sm:px-10">
      <div class="flex h-full">
        <div class="hidden min-h-full mr-4 xl:flex xl:flex-col xl:w-6/12" style="padding-left: 23px;">
          <AppLogo class="-enter-x" />
          <div class="my-auto">
            <img :alt="title" src="../../../assets/images/login-img.png" class="w-1/2 -mt-16 -enter-x" style="width: 602px; margin-left: -126px; margin-top: 0;" />
            <div class="-enter-x sign-in-title">
              <span style="margin-left: 64px;" class="inline-block"> {{ t('sys.login.signInTitle') }}</span>
            </div>
            <div class="-enter-x sign-in-desc">
              {{ t('sys.login.signInDesc') }}
            </div>
          </div>
        </div>
        <div class="flex w-full h-full py-5 xl:h-auto xl:py-0 xl:my-0 xl:w-6/12">
          <div :class="`${prefixCls}-form`"
            class="relative w-full px-5 py-8 mx-auto my-auto rounded-md shadow-md xl:ml-16 xl:bg-transparent sm:px-8 xl:p-4 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto enter-x">
            <LoginForm />
            <ForgetPasswordForm />
            <RegisterForm />
            <MobileForm />
            <QrCodeForm />
          </div>
        </div>
        <div style="display: none"><iframe src="/#/frame/workbench"></iframe></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, defineComponent, onMounted, onActivated } from 'vue';
  import { AppLogo, AppDarkModeToggle } from '/@/components/Application';
  import LoginForm from './LoginForm.vue';
  import ForgetPasswordForm from './ForgetPasswordForm.vue';
  import RegisterForm from './RegisterForm.vue';
  import MobileForm from './MobileForm.vue';
  import QrCodeForm from './QrCodeForm.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';

  defineComponent({
    name: 'Login',
  });

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });

  const globSetting = useGlobSetting();
  const { prefixCls } = useDesign('login');
  const { t } = useI18n();
  const title = computed(() => globSetting?.title ?? '');
  const userStore = useUserStore();

  const initStatus = () => {
    userStore.clearUserInfo();
  };

  onActivated(() => {
    initStatus();
  });

  onMounted(() => {
    initStatus();
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';
  @countdown-prefix-cls: ~'@{namespace}-countdown-input';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {

      transition: background-image 1s ease;
      background-color: #0e173f;
      background-image: url('/@/assets/images/login-bg-dark.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;

      .ant-input,
      .ant-input-password {
        background-color: #232a3b;
      }

      .ant-btn:not(.ant-btn-link, .ant-btn-primary) {
        border: 1px solid #4a5569;
      }

      &-form {
        background: transparent !important;
      }

      .app-iconify {
        color: #fff;
      }

      .@{prefix-cls}-form {
        .login-form-title {
          color: #fff;
        }
        .ant-input {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.16);
          background: rgba(7, 59, 109, 0.5);
        }
        .ant-input-affix-wrapper {
          border-color: rgba(255, 255, 255, 0.16);
          & > input.ant-input {
            border: none;
            background-color: transparent;
          }
        }
        .ant-input-password {
          background: rgba(7, 59, 109, 0.5);
        }
        .ant-form label {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .ant-checkbox-inner {
          background-color: #fff;
          border-color: #d9d9d9;
        }
        .ant-checkbox-checked {
          .ant-checkbox-inner {
            background-color: #1890FF;
          }
        }
        .ant-form {
          background-color: transparent;
        }
      }
    }

    input.fix-auto-fill,
    .fix-auto-fill input {
      -webkit-text-fill-color: #c9d1d9 !important;
      box-shadow: inherit !important;
    }
  }

  .@{prefix-cls} {
    min-height: 100%;
    overflow: hidden;
    background: url('/@/assets/images/login-bg-light.png') no-repeat center/100% 100%;

    @media (max-width: @screen-xl) {
      background-color: #293146;

      .@{prefix-cls}-form {
        background-color: #fff;
      }
    }

    .@{prefix-cls}-logo {
      width: 168px;
      height: 52px;
      background: url('/@/assets/images/logo-l.png') no-repeat 0 0/168px auto;
      top: 48px;
      left: 81px;
    }

    .@{logo-prefix-cls} {
      position: absolute;
      top: 12px;
      height: 30px;

      &__title {
        color: #fff;
        font-size: 16px;
      }

      img {
        width: 32px;
      }
    }

    .container {
      .@{logo-prefix-cls} {
        display: flex;
        width: 60%;
        height: 80px;

        &__title {
          color: #fff;
          font-size: 24px;
        }

        img {
          width: 48px;
        }
      }
      .sign-in-title {
        font-size: 28px;
        line-height: 1;
        font-weight: 600;
        margin-top: 23px;
        color: #feffff;
      }
      .sign-in-desc {
        font-size: 16px;
        line-height: 1;
        font-weight: 300;
        margin-top: 18px;
        color: #feffff;
      }
    }

    &-sign-in-way {
      .anticon {
        color: #888;
        font-size: 22px;
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }

    input:not([type='checkbox']) {
      min-width: 360px;

      @media (max-width: @screen-xl) {
        min-width: 320px;
      }

      @media (max-width: @screen-lg) {
        min-width: 260px;
      }

      @media (max-width: @screen-md) {
        min-width: 240px;
      }

      @media (max-width: @screen-sm) {
        min-width: 160px;
      }
    }

    .@{countdown-prefix-cls} input {
      min-width: unset;
    }

    .ant-divider-inner-text {
      color: @text-color-secondary;
      font-size: 12px;
    }

    .@{prefix-cls}-form {
      .login-form-title {
        font-size: 22px;
        color: #333333;
        line-height: 1;
        margin-bottom: 12px;
      }
      .ant-input {
        color: #262626;
        padding-top: 5px;
        padding-bottom: 5px;
      }
      .ant-input:hover {
        border-color: #1890ff;
      }
      .ant-input:focus,
      .ant-input-focused {
        border-color: #1890ff;
        box-shadow: none;
      }
      .ant-input-affix-wrapper {
        padding-top: 5px;
        padding-bottom: 5px;
        & > input.ant-input {
          padding: 0;
        }
        &:not(.ant-input-affix-wrapper-disabled):hover,
        &:hover {
          border-color: #1890ff;
        }
      }
      .ant-input-affix-wrapper:focus,
      .ant-input-affix-wrapper-focused {
        border-color: #1890ff;
        box-shadow: none;
      }
      .ant-form label {
        font-size: 13px;
        color: #666;
      }
      .ant-form-item-control-input {
        min-height: 25px;
        .ant-btn-sm {
          font-size: 13px;
        }
      }
      .ant-checkbox-inner {
        border-radius: 0;
      }
      .ant-btn {
        height: 34px;
        padding-top: 5px;
        padding-bottom: 5px;
      }
    }
  }
</style>
