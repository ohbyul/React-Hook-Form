import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

const UserJoinFormat = () => {
    //[1] joinInfo
    const { register, watch, handleSubmit
        , reset, setValue, getValues, setError, setFocus , clearErrors 
        , formState: { errors, isSubmitting, isDirty, dirtyFields, } 
    } = useForm({
        mode: 'onSubmit' , 
        defaultValues: {
            organizationCd : '',
            position:'',
            userName:'',
            userId: '',
            userPwd: '',
            userPwdChk: '',
            createSystemCd: 'PORTAL'
        } ,
      });
    
    const { organizationCd , position , userName , userId , userPwd ,userPwdChk } = watch();
    //[1-1] 기관 옵션 리스트
    const [organizations ,setOrganizations ] = useState([]);
    //[1-2] validation
    const [doubleCheckID , setDoubleCheckID] = useState(null)
    const [checkPw , setCheckPw] = useState(null)
    
    //[2] 아이디 중복 체크-------------------------------------------------------------   
    const onDoubleCheckID = () => {    
        if(!userId){
            return;
        }
        // 아이디 유효성 검사
        if(!regex_UserId.test(userId)){
            setError(
                'userId', 
                { message: "영문+숫자 최대 5~10자"},
                { shouldFocus: true },
            );
            return;
        }

        actionCheckId(userId).then((res)=>{
            if(res.statusCode ===10000){
                setDoubleCheckID(true)
                clearErrors('userId');
            }else{
                setDoubleCheckID(false)
                setError(
                    'userId', 
                    { message: "이미 사용중인 ID 입니다."},
                    { shouldFocus: true },
                );
            }
        })
    }

    //[3] validation  -------------------------------------------------------------
    useEffect(()=>{
        setDoubleCheckID(null)
    },[userId])

    useEffect(()=>{
        if(userPwd && userPwdChk ){
            if(userPwd == '' && userPwdChk == ''){
                setCheckPw(null)
            }else if(userPwd===userPwdChk){
                setCheckPw(true)
                clearErrors('userPwdChk')
            }else{
                setCheckPw(false)
                setError(
                    'userPwdChk', 
                    { message: "비밀번호가 동일 하지 않습니다."},
                    { shouldFocus: true },
                );
            }
        }
    },[ userPwd, userPwdChk ])


    //[4] 회원가입 -------------------------------------------------------------
    const onSubmit = async (data) =>{ 
        await new Promise((r) => setTimeout(r, 1000));      //중복제출 방지 -> 1초 텀
        // console.log(data)

        // //[1-3] 아이디 중복 검사
        if(!doubleCheckID){
            setError(
                'userId', 
                { message: "중복 확인이 필요합니다."},
                { shouldFocus: true },
            );
            return;
        }

        if(!checkPw){
            setError(
                'userPwdChk', 
                { message: "비밀번호가 동일 하지 않습니다."},
                { shouldFocus: true },
            );
            return;
        }

        //[2] 가입
        actionSignUp(data).then((response) => {
            if (response.statusCode == "10000") {
                setAlertDialogObject({
                    description: [response.message],
                    close: ()=>{
                        setShowAlertDialog(false)
                        setShowTESTModal(false)
                    }
                })
                setShowAlertDialog(true)
                return
            }else {
                funcAlertMsg(response.message)
                return
            }
        })
    }


    return (
        <div className="alertPopUp">
            <div id="submit-modal" className="modal-overlay modaltest">
                <div className="submit-modal-window">
                    <div className="dialog_tit" id="commonMsg">React-Hook-Form</div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                    
                    <div className="signUp_Area">
                        <div className="">
                            <label className='required'>소속기관</label>
                            <div className='selectbox__basics'>
                                <select name='organizationCd' 
                                    {...register("organizationCd", {
                                        required: '소속기관을 선택해주세요.' 
                                        })
                                    }
                                >
                                    <option value=''>소속기관</option>
                                    {
                                        organizations?.length > 0 ?
                                        organizations?.map( (item, index) => {
                                            return(
                                                <option value={item.ORGANIZATION_CD} key={index}>{item.ORGANIZATION_NM}</option>
                                            )
                                        }) : ''
                                    }
                                </select>
                                <div className="selectbox__arrow"></div>
                            </div>
                            {errors.organizationCd ? <p className='error'>{errors.organizationCd.message}</p> : <p role="alert"></p>}
                        </div>
                        <div className="">
                            <label className='required'>직책</label>
                            <input 
                                type="text" 
                                id="position"
                                name="position"
                                placeholder="직책"
                                {...register("position", {
                                    required: '직책을 입력해주세요.' , 
                                    minLength: {
                                        value : 2 , 
                                        message : '최소 2글자 이상 입력 해주세요.'
                                    } , 
                                    pattern: {
                                        value: /^[A-za-z0-9가-힣]{2,10}$/ ,
                                        message: '가능한 문자: 영문 대소문자, 글자 단위 한글, 숫자' ,
                                    } ,
                                })}
                            />
                            {errors.position ? <p className='error'>{errors.position.message}</p> : <p role="alert"></p>}
                        </div>
                        <div className="">
                            <label className='required'>성명</label>
                            <input 
                                type="text" 
                                name="userName"
                                placeholder="성명"
                                autoComplete='off'
                                {...register("userName", {
                                    required: '성명을 입력해주세요.' , 
                                    minLength: {
                                        value : 2 , 
                                        message : '최소 2글자 이상 입력 해주세요.'
                                    } , 
                                    maxLength : {
                                        value: 10 , 
                                        message : '최대 10자 이하 입력해주세요'
                                    } , 
                                    onChange : (e) => {
                                        setValue('userName' , e.target.value.replace(NotSpace,''))
                                    } , 
                                    validate : (e) => {} ,
                                })}
                            />
                            {errors.userName ? <p className='error'>{errors.userName.message}</p> : <p role="alert"></p>}
                        </div>
                        <div>
                            <label className='required'>아이디</label>
                            <input 
                                type="text" 
                                name="userId"
                                className='id-input'
                                placeholder="영문+숫자 최대 5~8자"
                                autoComplete='off'
                                {...register("userId", { 
                                    required: '아이디을 입력해주세요.' , 
                                    minLength : {
                                        value: 5 , 
                                        message : '최소 5자 이상 입력해주세요'
                                    } , 
                                    maxLength : {
                                        value: 8 , 
                                        message : '최대 8자 이하 입력해주세요'
                                    } , 
                                    pattern: {
                                        value: /^[A-za-z0-9]{5,8}$/ ,
                                        message: '영문+숫자 최대 5~8자' ,
                                    } ,
                                })}
                            />
                            <button className='btn-blue' type='button' onClick={onDoubleCheckID}>중복 확인</button>
                            {
                                 errors.userId ? <p className='error'>{errors.userId.message}</p>
                                 : doubleCheckID ? <p className='success'>사용 가능한 아이디 입니다.</p> 
                                 : <p role="alert">중복 확인이 필요합니다.</p> 
                            }
                        </div>
                        <div>
                            <label className='required'>비밀번호</label>
                            <input 
                                type="password" 
                                name="userPwd"
                                placeholder="비밀번호"
                                autoComplete='off'
                                {...register("userPwd", { 
                                    required: '비밀번호을 입력해주세요.' , 
                                    minLength : {
                                        value: 8 , 
                                        message : '최소 8자 이상 입력해주세요'
                                    } , 
                                    maxLength : {
                                        value: 20 , 
                                        message : '최대 20자 이하 입력해주세요'
                                    } , 
                                    pattern: {
                                        value :/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/,
                                        message : '8~20자의 영문, 숫자 및 특수문자'
                                    }
                                })}
                            />
                            {errors.userPwd ? <p className='error'>{errors.userPwd.message}</p> : <p role="alert">8~20자의 영문, 숫자 및 특수문자 포함</p>}
                        </div>
                        <div>
                            <label className='required'>비밀번호 확인</label>
                            <input 
                                type="password" 
                                name="userPwdChk"
                                placeholder="비밀번호 확인"
                                {...register("userPwdChk", { 
                                    required: '비밀번호를 한번 더 입력해주세요.' , 
                                })}
                            />
                            {
                                 errors.userPwdChk ? <p className='error'>{errors.userPwdChk.message}</p>
                                 : checkPw ? <p className='success'>비밀번호가 동일합니다.</p>
                                 : <p></p>
                            }
                        </div>

                    </div>

                    <div className="btn-wrap">
                        <button type="submit" className="btn-blue" disabled={isSubmitting}>확인</button>
                        <button type="button" className="btn-white"ref={cancelTESTRef} onClick={()=>setShowTESTModal(false)}>취소</button>
                    </div>
                    
                    </form>

                </div>
            </div>
        </div>
    );
};

export default UserJoinFormat;