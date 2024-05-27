<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12" class="forget-password">
        <FormItem :style="{ 'text-align': 'right' }">
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed, onMounted } from 'vue';
  import { Checkbox, Form, Input, Row, Col, Button } from 'ant-design-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { md5 } from '/@/utils/encryption/crypto';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  const formData = reactive({
    account: '',
    password: '',
  });

  const { validForm } = useFormValid(formRef);
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        loginName: data.account,
        password: data.password,
        mode: 'none', //不要默认的错误提示
      });
      if (userInfo) {
        const params = {
          remember: rememberMe.value,
          account: data.account,
          password: md5(data.password),
        };
        rememberMe.value
          ? localStorage.setItem('REMEMBER_ME_INFO', JSON.stringify(params))
          : localStorage.setItem('REMEMBER_ME_INFO', '');
        localStorage.setItem('LOGIN_TIMESTAMP', String(new Date().getTime()));
        const username = userInfo.username || userInfo.userId;
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${username}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }

  const handleLoadAccount = () => {
    const info = localStorage.getItem('REMEMBER_ME_INFO');
    if (info) {
      const data = JSON.parse(info);
      rememberMe.value = data.remember;
      formData.account = data.account;
      formData.password = data.password;
    }
  };

  onMounted(() => {
    handleLoadAccount();
  });
</script>
<style lang="less" scoped>
  .enter-x {
    .forget-password {
      display: none;
    }
  }
</style>
