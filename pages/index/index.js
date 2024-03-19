
var app = getApp();
import * as xy from "../../utils/common.js";
// index.js
Page({ 
  data:{
    notVip: false,
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff', 
    initCamral:false, 
    select: 0, 
    selectPicturPath:"",
    ccWidth:0,
    ccHeight:0,
    showSelectImg:false,
    navBarHeight: app.globalData.navBarHeight, 
    screenHeight: app.globalData.screenHeight, 
    sysInfo:{},
    list: [
      {
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAqCAYAAAAqAaJlAAAAAXNSR0IArs4c6QAABQZJREFUWEfNmcl2G0UUhv8rLwiEedrh1kuYk4QHYB4SsmHDmmSB1W3iIWFHssNdshOWWcKG4R2wsWLYhpmAVYLD8BK5cKurSlWl1uQjRegcHbWtatVXf93731sSYczjmVVeaSzhHTAIhBXzWj3kddg1GCBy78s9DcDeG94TfQ4BbWaQblNZh+VurEVuFnwBjAvyAcFkcwGVxVXr8SIorWg7BBsKK4ouNXBzQaDVLhBuaUXnHfBQ2Kzgm7iLZxegaAXqwoZR6jZ96LazNgSyFt9eOKiERCXnm7qkTq2yJqkaWDHDXEL1E8QvzoSIezSCa/t/ucWr5MYF9zDjNAinfaKmiSifXo3vaEXnRibYOKeY1ftZzmtgFJFj9EEJjI5u09n/BaxbdJbzn0blENTapFb0tIGNtn3+W18lj50ntKes4DMAPq/zYwMrXsp3cXFhyUQoI+CcvwDwXFB4jBFoRU9RlvNFEMT851aZagw/tifCecl2ocr6sH2eqqo9SVnBtxcKKjHK2HZemuV8CYA8K2utigO0Eticvw0kn2mtH6tov7eQSnXOKutgPagNgycc7MybkilAvY8K7HKL14lwySnqPFgrMrDf1XVPDeDtI0XfzMpLrWprAOQZ76D1UQ8LrNsRfpxW9LjAfp+GATM+6rXp+ixBAy/9ayDsCB1d0tlA2fV0QVrRYw42CgNm3JgzbDwf0OkpesPAFrxBDIGtEszugoP9IVkFUtgs548BnJJxxNhFA4fdkg6Po3yW898D89XDRgvSih4VZX8MDdg0v4QbvZJ2zUpzXiXg3WSCQ63orWPC/pMaPgMHibIb0XxiXWUf1gSyO4ow4XoCu1pTUZqTwNoSKkPPgCHlVKpTZPgEHHTb9LoMaha8wYxNP5/tE7SiR0TZn0JQcx3ANgs+xYxPwgkI2OkqUqNgDSSbzBfA1BojwyfCQbe0sDlvMlApGzQ0WtHDBjY93BlYRTtBBh+FAS8Hu2GwFrJI6vvgIdFWJpMHoqyi14yyFexm2nkZ2OWcf05PocwxrN2eFjA6sSzoZ6NOvWEJdeMGYAmbaef1X7PzkCj7i1Et6NIJ2O0Gyk4SmzLG96OJ7aQxmho+gAOt6FUjSou3WGDjwiG9gYVNjhNiT902tSeFtKCiaNjajdz6xEe/8rAFbzFjqyahH6SsxXdqvoD4ehprMscS4L0EwJl6lExDQkSUfcWGm4NNW8ST0iLeqevMibDTLcerWwPqIKPJarY+VF6UNbBZzpeBQNl+i3hSYvbXND6c1Rwj66cHrexJlH05gU1bxAcE9rc0Phy8sTSGi91bPoYp8s94uxPDH6lo30dF2RD2ck2L6GEHmu4p+9HjKuqKxX4Ey7hS0yLeL8pGhu+qWfIlWXxmSmxloEIFhl+bdINHbVH2JRMGLRZQidtIQK3ohIP15fAeK+p2RJStYAu+AlE28WoH2w1j9B4r6tQTZV9MYPv9BOOabtMHoqxe0NaH2yzKVrA5vw8YZcMjzX1mCwR2QVvviwUD+702vRDACrB7/6qoav5Yzrm3oK33PsqE/V4ZwxJhD4xrXUVfOsukZs694KvxeWd9bVUzyip63vv4kAsJg999fEz4Q0VdmzdgX4P2NLT8TgP7h1nIgkBt873XnVDZT83ZaIKffmatqN8Na02ThMEaCMW436jmBgrzpduJcaC+AZlJmzdFjPqujrFHS7h6tE17k8D+CyjJt0kSpFT0AAAAAElFTkSuQmCC",
        "pagePath": "/pages/index/index",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAqCAYAAAAqAaJlAAAAAXNSR0IArs4c6QAABQZJREFUWEfNmcl2G0UUhv8rLwiEedrh1kuYk4QHYB4SsmHDmmSB1W3iIWFHssNdshOWWcKG4R2wsWLYhpmAVYLD8BK5cKurSlWl1uQjRegcHbWtatVXf93731sSYczjmVVeaSzhHTAIhBXzWj3kddg1GCBy78s9DcDeG94TfQ4BbWaQblNZh+VurEVuFnwBjAvyAcFkcwGVxVXr8SIorWg7BBsKK4ouNXBzQaDVLhBuaUXnHfBQ2Kzgm7iLZxegaAXqwoZR6jZ96LazNgSyFt9eOKiERCXnm7qkTq2yJqkaWDHDXEL1E8QvzoSIezSCa/t/ucWr5MYF9zDjNAinfaKmiSifXo3vaEXnRibYOKeY1ftZzmtgFJFj9EEJjI5u09n/BaxbdJbzn0blENTapFb0tIGNtn3+W18lj50ntKes4DMAPq/zYwMrXsp3cXFhyUQoI+CcvwDwXFB4jBFoRU9RlvNFEMT851aZagw/tifCecl2ocr6sH2eqqo9SVnBtxcKKjHK2HZemuV8CYA8K2utigO0Eticvw0kn2mtH6tov7eQSnXOKutgPagNgycc7MybkilAvY8K7HKL14lwySnqPFgrMrDf1XVPDeDtI0XfzMpLrWprAOQZ76D1UQ8LrNsRfpxW9LjAfp+GATM+6rXp+ixBAy/9ayDsCB1d0tlA2fV0QVrRYw42CgNm3JgzbDwf0OkpesPAFrxBDIGtEszugoP9IVkFUtgs548BnJJxxNhFA4fdkg6Po3yW898D89XDRgvSih4VZX8MDdg0v4QbvZJ2zUpzXiXg3WSCQ63orWPC/pMaPgMHibIb0XxiXWUf1gSyO4ow4XoCu1pTUZqTwNoSKkPPgCHlVKpTZPgEHHTb9LoMaha8wYxNP5/tE7SiR0TZn0JQcx3ANgs+xYxPwgkI2OkqUqNgDSSbzBfA1BojwyfCQbe0sDlvMlApGzQ0WtHDBjY93BlYRTtBBh+FAS8Hu2GwFrJI6vvgIdFWJpMHoqyi14yyFexm2nkZ2OWcf05PocwxrN2eFjA6sSzoZ6NOvWEJdeMGYAmbaef1X7PzkCj7i1Et6NIJ2O0Gyk4SmzLG96OJ7aQxmho+gAOt6FUjSou3WGDjwiG9gYVNjhNiT902tSeFtKCiaNjajdz6xEe/8rAFbzFjqyahH6SsxXdqvoD4ehprMscS4L0EwJl6lExDQkSUfcWGm4NNW8ST0iLeqevMibDTLcerWwPqIKPJarY+VF6UNbBZzpeBQNl+i3hSYvbXND6c1Rwj66cHrexJlH05gU1bxAcE9rc0Phy8sTSGi91bPoYp8s94uxPDH6lo30dF2RD2ck2L6GEHmu4p+9HjKuqKxX4Ey7hS0yLeL8pGhu+qWfIlWXxmSmxloEIFhl+bdINHbVH2JRMGLRZQidtIQK3ohIP15fAeK+p2RJStYAu+AlE28WoH2w1j9B4r6tQTZV9MYPv9BOOabtMHoqxe0NaH2yzKVrA5vw8YZcMjzX1mCwR2QVvviwUD+702vRDACrB7/6qoav5Yzrm3oK33PsqE/V4ZwxJhD4xrXUVfOsukZs694KvxeWd9bVUzyip63vv4kAsJg999fEz4Q0VdmzdgX4P2NLT8TgP7h1nIgkBt873XnVDZT83ZaIKffmatqN8Na02ThMEaCMW436jmBgrzpduJcaC+AZlJmzdFjPqujrFHS7h6tE17k8D+CyjJt0kSpFT0AAAAAElFTkSuQmCC",
        "text": "传图翻译",
        "type":0,
        "notpage":1
      },
      {
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAqCAYAAADWFImvAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAPiSURBVFiFtVjNbhRHEP6qMzwFwrMPQQReyzwHUqRc4cbMCAw5AiJKFGfXgSPXXPIAeQAuNuaKOCJ5LfEa++Uw/VPdXWMv3k1Zux73THV99fXXVT0WKLvT864TPALxox8S/yUkBA4AxzF/T19nY7LGzxd/yTkAtAP/JvDpciFvMWEuXLQD3zvgvQZBQAwQ+mOCYBobjRAhnrQ9v856PpkEMuv5GMRdABKCERAHoAIhZvDEhAdvxArzdrOBXQVk1vMxgUcRxDjLCEIw/mgQE6yQnj0LhOQJkOhmPfsMCOGZQAJBQpgApMyZB49ZEuJELYlAcEtFYeabmFFgHDyQbfQQQVAxuK6YSeyFDzG0A4cAZGs9RBDad437kRDFSIglaamHtuO+24keWPtScC/S7nACz5pDXMK03IK5tB0/f099MPWgfVUCInh4sZCPAVDbcR+ludG3KfRQBs9BlHqwEmDyXQMdgIch5upEziogEc8u9FCyyAhqPuv5j8lEYdL2/FLoIQNULUXQQ3gu+dbsIdMDAJxZMSA4blDQmU1m6QEmiGxyAiJjLUrzjgkcmL7EWVOhu6EeoHaRUC118L06ATQ6ePgtqfrB0EM+qQ+aLUUJ4roECGnKAVMPwdHSg10fNk4gjEUgk3ogzuOEI6BYgR0zBnUgFAnMK0BaPz+MQKb0cC6CdxfLVJC2sbbnMxDzTLCBFU+CWR9WS/lJV8VtbbWUPyA4RV7a4f+GM/uF4HxXALSROPWXoRYJAHEcNRaG9Trfr6fZiR2E4AoQgLHlmAcg6zi3je11PBDBEVDHAsYS/xW16vWx8WMcE79j9LNUXBZbNz5LiIhioygDQvzeWDdi0FHI+0zo6/qgt2GxEyQlcHVvckCjbmzaL6wCZ9cHSw92gUNT3tiiX0xWzQhoIoFU4nfQLwrW0pi1FLUvokZ20S+wiR7KOfw8scRXegDO4LBcLSQUoa1sNvAXEi8Af/jOY0H2el5aelgt5PYuAGhre/4L4EGIHRkV/OrE1sPkIXcbWwO/VSDU0lylh52aAw4rEKHpRRD5C9K8Hfj0f8ByiKLhhZSlHfht6gXJjx2rsh5fiGIW+l6qN8h8gEMQD4wdFg5cb5oN9viRBAcNsu471nYFNilwUEfFax1vUh8CS9cUOArE7jU36xdWfZhKoOo1zm/VeCNoRzlUVbAAGz8RhOV7RQIjEMFxRpO1vco3vDxYPum0HrIE9L8mLpfyyq0WckriT4POyTU1MkrBNkiAinkSr/Vk2Ot4VB3lvlcPG/iWIC5P5GUGBAD2Bj73vD3fFNDEDpt+XvDBn95eXSzlQ4j9H/tVs/9rGt4PAAAAAElFTkSuQmCC",
        "pagePath": "/pages/text/index",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAqCAYAAADWFImvAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAPiSURBVFiFtVjNbhRHEP6qMzwFwrMPQQReyzwHUqRc4cbMCAw5AiJKFGfXgSPXXPIAeQAuNuaKOCJ5LfEa++Uw/VPdXWMv3k1Zux73THV99fXXVT0WKLvT864TPALxox8S/yUkBA4AxzF/T19nY7LGzxd/yTkAtAP/JvDpciFvMWEuXLQD3zvgvQZBQAwQ+mOCYBobjRAhnrQ9v856PpkEMuv5GMRdABKCERAHoAIhZvDEhAdvxArzdrOBXQVk1vMxgUcRxDjLCEIw/mgQE6yQnj0LhOQJkOhmPfsMCOGZQAJBQpgApMyZB49ZEuJELYlAcEtFYeabmFFgHDyQbfQQQVAxuK6YSeyFDzG0A4cAZGs9RBDad437kRDFSIglaamHtuO+24keWPtScC/S7nACz5pDXMK03IK5tB0/f099MPWgfVUCInh4sZCPAVDbcR+ludG3KfRQBs9BlHqwEmDyXQMdgIch5upEziogEc8u9FCyyAhqPuv5j8lEYdL2/FLoIQNULUXQQ3gu+dbsIdMDAJxZMSA4blDQmU1m6QEmiGxyAiJjLUrzjgkcmL7EWVOhu6EeoHaRUC118L06ATQ6ePgtqfrB0EM+qQ+aLUUJ4roECGnKAVMPwdHSg10fNk4gjEUgk3ogzuOEI6BYgR0zBnUgFAnMK0BaPz+MQKb0cC6CdxfLVJC2sbbnMxDzTLCBFU+CWR9WS/lJV8VtbbWUPyA4RV7a4f+GM/uF4HxXALSROPWXoRYJAHEcNRaG9Trfr6fZiR2E4AoQgLHlmAcg6zi3je11PBDBEVDHAsYS/xW16vWx8WMcE79j9LNUXBZbNz5LiIhioygDQvzeWDdi0FHI+0zo6/qgt2GxEyQlcHVvckCjbmzaL6wCZ9cHSw92gUNT3tiiX0xWzQhoIoFU4nfQLwrW0pi1FLUvokZ20S+wiR7KOfw8scRXegDO4LBcLSQUoa1sNvAXEi8Af/jOY0H2el5aelgt5PYuAGhre/4L4EGIHRkV/OrE1sPkIXcbWwO/VSDU0lylh52aAw4rEKHpRRD5C9K8Hfj0f8ByiKLhhZSlHfht6gXJjx2rsh5fiGIW+l6qN8h8gEMQD4wdFg5cb5oN9viRBAcNsu471nYFNilwUEfFax1vUh8CS9cUOArE7jU36xdWfZhKoOo1zm/VeCNoRzlUVbAAGz8RhOV7RQIjEMFxRpO1vco3vDxYPum0HrIE9L8mLpfyyq0WckriT4POyTU1MkrBNkiAinkSr/Vk2Ot4VB3lvlcPG/iWIC5P5GUGBAD2Bj73vD3fFNDEDpt+XvDBn95eXSzlQ4j9H/tVs/9rGt4PAAAAAElFTkSuQmCC",
        "text": "文本翻译",
        "type":0
      },
      {
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAARDSURBVFiFxVlLchs3EH0Pcq5h8g52SvTnLlnaq4hkaZFkGTuLVEUUFSc3iG+QC1i2o4p8CFPKOTTtxcxgGo3PYCLKQpVIafDp97r7oYERYdp8JS8FeIz2hwLQARAB4QAICICg+r1t/lsEdAQEIOw8M7b/XQBSQBIX3bzN1ZYXFl+u9Qv2BF5YY+yA1YCJSKCjLOmxkNYh3lm6v+27ALG52vCfKiLztbwQwUtrIEEiBpMiHoLJjoWOuCWhHSc4udrytxIRBwA5En5EnkTgELEknOpnOBZqrIjqTUWfOJ6t5WmRyHwlA4nuMzCgSSTAaBIedwqMxMQ7NvSW4+hDzX9WJCLEIxgvBeLWJNIagYhKjxKYhLgH9yknmLHd93GJyANrLLlDhQb6sZd9HwnIAGkxloreWZqE1VPruMAJD5fy7HrLj2kigm9HxO0Xo+DTbsvvSp65r+amiJvEn/eAsaq5WnFTcPn5lJf3AbKmPUhUbiAh7lQ05kdy6P/4BkATpKNvknkOoHPlhDkNeP07P0REKsX9yUZjtpa/RHCIvnLfAMgVPVYUvdhxtsq3ax6As7UAgo/i8Ov1SUvKlcRtgMWtos74tLVbbGWdQbhFa8LP2eDv+Vp+BABXU7kd8IfGPz+SQzRY1NYZ6vXrHcfoMyRMtLvsDy3GisqdFHmFR5NFb8KRJ9GfxDpbyU8u6Eh7NCIhDt/XVG439AxkK488ETE7NsT6fEiODDA2YVp1bVEyXDzRamDGcWqBkBiR1VCvPReBCRfB7oz/agbzY7/l7l3c/qxm1ZFJRRFPni4CE4orSqvmBgtkPOoX2p+4i6lINdblwIik04pEG5GvIW4NvOA4CD4MWWtC5rQZ3aSLSD9H7lDc43WGELARvI81AqC/c0f6WMvCjgW/qrgpCfsAEEWE4eCgieAot/DodXUP4laGg/7/zngeRMTuNLOVvO13qflSlgDiiAD119XErjhF3CliQpwD6oaYeRe1kBssZiuxUcqLGyiL2wK34ta3wry4Q8ehqyPRu6iKnSYrbntdDeflU620K9mIKZsHDX7pISMgUXmiHRX3ALbs0TFxj6Vil1Nu9F1Uoc4EwPJvIkPDE1ORFrhJxc8nPAcAN/VdVEXRi4HrZ2MasfMLqcgG7/sHbuq7qNGiN1XceuzEVOQBXnsi/rNS3KNFL+OEfYk7sVZHYbq4h8Vuf12NbU1IxV4fLZHp4p52ot2zuNVzTwJoXz68QcGjtz7R7lHc2snEoA9A71r/V9wlMJbYLcWt19qd8l1AZHfKs9Rid3iiTdryzypSUUw0gG7XIhGQuePrqgYZXFejz3Qqvrs+5c9JIrsNt0RA5l6uqxngQ39LOoqGXgAAMFvKExJLETw1kMpFL34WgumjmE6vIbppXfRPX19t+CpFIiKiCXW9w//tdDRMdCTsYz8kmKP0JWLsau2ZOSTOrbBT7QuPPfblGTA91QAAAABJRU5ErkJggg==",
        "pagePath": "/pages/file/index",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAARDSURBVFiFxVlLchs3EH0Pcq5h8g52SvTnLlnaq4hkaZFkGTuLVEUUFSc3iG+QC1i2o4p8CFPKOTTtxcxgGo3PYCLKQpVIafDp97r7oYERYdp8JS8FeIz2hwLQARAB4QAICICg+r1t/lsEdAQEIOw8M7b/XQBSQBIX3bzN1ZYXFl+u9Qv2BF5YY+yA1YCJSKCjLOmxkNYh3lm6v+27ALG52vCfKiLztbwQwUtrIEEiBpMiHoLJjoWOuCWhHSc4udrytxIRBwA5En5EnkTgELEknOpnOBZqrIjqTUWfOJ6t5WmRyHwlA4nuMzCgSSTAaBIedwqMxMQ7NvSW4+hDzX9WJCLEIxgvBeLWJNIagYhKjxKYhLgH9yknmLHd93GJyANrLLlDhQb6sZd9HwnIAGkxloreWZqE1VPruMAJD5fy7HrLj2kigm9HxO0Xo+DTbsvvSp65r+amiJvEn/eAsaq5WnFTcPn5lJf3AbKmPUhUbiAh7lQ05kdy6P/4BkATpKNvknkOoHPlhDkNeP07P0REKsX9yUZjtpa/RHCIvnLfAMgVPVYUvdhxtsq3ax6As7UAgo/i8Ov1SUvKlcRtgMWtos74tLVbbGWdQbhFa8LP2eDv+Vp+BABXU7kd8IfGPz+SQzRY1NYZ6vXrHcfoMyRMtLvsDy3GisqdFHmFR5NFb8KRJ9GfxDpbyU8u6Eh7NCIhDt/XVG439AxkK488ETE7NsT6fEiODDA2YVp1bVEyXDzRamDGcWqBkBiR1VCvPReBCRfB7oz/agbzY7/l7l3c/qxm1ZFJRRFPni4CE4orSqvmBgtkPOoX2p+4i6lINdblwIik04pEG5GvIW4NvOA4CD4MWWtC5rQZ3aSLSD9H7lDc43WGELARvI81AqC/c0f6WMvCjgW/qrgpCfsAEEWE4eCgieAot/DodXUP4laGg/7/zngeRMTuNLOVvO13qflSlgDiiAD119XErjhF3CliQpwD6oaYeRe1kBssZiuxUcqLGyiL2wK34ta3wry4Q8ehqyPRu6iKnSYrbntdDeflU620K9mIKZsHDX7pISMgUXmiHRX3ALbs0TFxj6Vil1Nu9F1Uoc4EwPJvIkPDE1ORFrhJxc8nPAcAN/VdVEXRi4HrZ2MasfMLqcgG7/sHbuq7qNGiN1XceuzEVOQBXnsi/rNS3KNFL+OEfYk7sVZHYbq4h8Vuf12NbU1IxV4fLZHp4p52ot2zuNVzTwJoXz68QcGjtz7R7lHc2snEoA9A71r/V9wlMJbYLcWt19qd8l1AZHfKs9Rid3iiTdryzypSUUw0gG7XIhGQuePrqgYZXFejz3Qqvrs+5c9JIrsNt0RA5l6uqxngQ39LOoqGXgAAMFvKExJLETw1kMpFL34WgumjmE6vIbppXfRPX19t+CpFIiKiCXW9w//tdDRMdCTsYz8kmKP0JWLsau2ZOSTOrbBT7QuPPfblGTA91QAAAABJRU5ErkJggg==",
        "text": "文件翻译",
        "type":0
      },
      {
        "iconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAqCAYAAADf/ynVAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAOGSURBVFiF1Zg/bBxFFMZ/3yRQIVFRmjMVQlAkEk6BZKLQIWjoEUVo7CKKz+5AFJAg0mBfUkRRREMTahBdKkOojAQSUGd9jkRFG6Xg7qO43fXN/j/fXsFI6zvNmzfvN9+8eTs+cca2tucNTbgicdHwuuB5QTAIIYyAAAiQQUq/IxRg+/G+fqib//zCQENvBthiykU0C6T06QqF07ENbSGwwa53MR9nAbNnUaj0s7F1Bhvs+Cbmg56gGtXqDDYYeg96hHI+rraFVqhdXwGu9gqldsVawWS2e4cy4twSYGtDbxre6B1KyNMltlLmnVVA0ZJf7WBwYUVQrSezOcfEayuBWlaxFUItDTZZEZQkni4DlqwCCtBkwpOzg4m/VgEFPDu5oz/PDCbzaAVQwjxsFKQNLDnQ94h/eoWC4MCDpcAAPOV+n1DA4XhfPy4NNh7pvuCXnqCE+KQtZicwAMwukCwLJXP1eF+/9QZ2PNLfMh8K/lgGKhnpu05CdAUDSEZKkhd5T+LbRXMK8dYiUNDh1VDV1nd8weIjwfuGlyqAnmEeOvCgS6L3BjbfXrnuV/8NDIJ5QeLpZMKTtuL5v26Niq3teeN84aaZ3zyfA+ZspRtpaLBN0fiOHi0EtnbdGyGwDVyikDs2QTWJbwjK+uN6F4rz5HYIEreSfX3VCDYY+hvBJVfcKKB0N4ts0duBCpg2m7l1PNKXJbDB0L+nA7J/r6onrSsT9VfouL9BzTDl3ce39RMpPetDb2WK5JVN+d9cEXKPClu2xBDb8v7s0zlwKY0mgU+z72F96C3DVm6tcQyZzXnQ2Jb5lAPO+8QHKe6XxNuDHX92OqfT/KmaNFXENWq6Rc258aVdUDGakQKbMPs9683abYgVqVQzslWoGanVQU2by7N5zYYztSocnf2WVWU7Vas2N0s51kHN9aEvB5SuumYbQouauSr1ST3f31nNgPjVNdsQqVVwNEhVwTqqQlnN6PSHOTVKjgW1mgIW61oM2U3NvCM50GGYTrhX51hQK7KpPlgMU2iuW9ypWrMCe3JbRzZHxeQslYCi3PW5Vwo4/xRIowUIsDmt/D7H3eIKSwW1XCIqc0+ZX/W2lmAyp/SE3xiP9Hke4+RrHQF3s2F50sdqkanV+fVUTPY6NWegN8YH+iJa4Hx7ecfXCEjmGhU3AZGf1OaXfXV/5Cfzs4UEN5MDHc5z/Af3rZrdnibXdgAAAABJRU5ErkJggg==",
        "pagePath": "/pages/my/index",
        "selectedIconPath": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAqCAYAAADf/ynVAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAOGSURBVFiF1Zg/bBxFFMZ/3yRQIVFRmjMVQlAkEk6BZKLQIWjoEUVo7CKKz+5AFJAg0mBfUkRRREMTahBdKkOojAQSUGd9jkRFG6Xg7qO43fXN/j/fXsFI6zvNmzfvN9+8eTs+cca2tucNTbgicdHwuuB5QTAIIYyAAAiQQUq/IxRg+/G+fqib//zCQENvBthiykU0C6T06QqF07ENbSGwwa53MR9nAbNnUaj0s7F1Bhvs+Cbmg56gGtXqDDYYeg96hHI+rraFVqhdXwGu9gqldsVawWS2e4cy4twSYGtDbxre6B1KyNMltlLmnVVA0ZJf7WBwYUVQrSezOcfEayuBWlaxFUItDTZZEZQkni4DlqwCCtBkwpOzg4m/VgEFPDu5oz/PDCbzaAVQwjxsFKQNLDnQ94h/eoWC4MCDpcAAPOV+n1DA4XhfPy4NNh7pvuCXnqCE+KQtZicwAMwukCwLJXP1eF+/9QZ2PNLfMh8K/lgGKhnpu05CdAUDSEZKkhd5T+LbRXMK8dYiUNDh1VDV1nd8weIjwfuGlyqAnmEeOvCgS6L3BjbfXrnuV/8NDIJ5QeLpZMKTtuL5v26Niq3teeN84aaZ3zyfA+ZspRtpaLBN0fiOHi0EtnbdGyGwDVyikDs2QTWJbwjK+uN6F4rz5HYIEreSfX3VCDYY+hvBJVfcKKB0N4ts0duBCpg2m7l1PNKXJbDB0L+nA7J/r6onrSsT9VfouL9BzTDl3ce39RMpPetDb2WK5JVN+d9cEXKPClu2xBDb8v7s0zlwKY0mgU+z72F96C3DVm6tcQyZzXnQ2Jb5lAPO+8QHKe6XxNuDHX92OqfT/KmaNFXENWq6Rc258aVdUDGakQKbMPs9683abYgVqVQzslWoGanVQU2by7N5zYYztSocnf2WVWU7Vas2N0s51kHN9aEvB5SuumYbQouauSr1ST3f31nNgPjVNdsQqVVwNEhVwTqqQlnN6PSHOTVKjgW1mgIW61oM2U3NvCM50GGYTrhX51hQK7KpPlgMU2iuW9ypWrMCe3JbRzZHxeQslYCi3PW5Vwo4/xRIowUIsDmt/D7H3eIKSwW1XCIqc0+ZX/W2lmAyp/SE3xiP9Hke4+RrHQF3s2F50sdqkanV+fVUTPY6NWegN8YH+iJa4Hx7ecfXCEjmGhU3AZGf1OaXfXV/5Cfzs4UEN5MDHc5z/Af3rZrdnibXdgAAAABJRU5ErkJggg==",
        "text": "个人中心",
        "type":0
      }
    ],
  }, 
  // 页面切换
    selectPage(e) {
        const { index, page, type,notpage } = e.currentTarget.dataset;
        if(notpage===1){ 
          this.setData({
            showSelectImg:  this.data.showSelectImg?false:true
          })
          return false;
        }
        console.warn(index, page, type ); 
        wx.navigateTo({
          url: page
        })
        // wx.switchTab({url:page})
        // this.setData({
        //   selected: index
        // })
    }, 
    //拍照
    takePhoto(){ 
        console.log("cam inited")  
        const tThis= this;
        const ctx = wx.createCameraContext();
        ctx.setZoom({
            zoom:0.5
        })
        wx.showLoading({ title: "翻译中...", mask: true });
        ctx.takePhoto({ 
          quality: 'high',
          success: (res) => {
              console.warn("takePhoto::",res) 
              tThis.confirmImginfo(res,res.tempImagePath);
              // xy.checkImageSync({
              //   tempFilePaths: res.tempImagePath,
              //   instance: tThis,
              //   success: (imgRes) => { 
              //     tThis.confirmImginfo(res,res.tempFiles[0]['tempFilePath']);
                  
              //      wx.hideLoading();
              //     console.warn("takePhoto::imgRes::",imgRes)
              //       tThis.setData({
              //         selectPicturPath: imgRes.url,
              //         initCamral:true,
              //         showSelectImg:  false
              //       }) 
              //       app.globalData.selectPicturPath=imgRes.url;
              //       wx.navigateTo({
              //         url: "/pages/indexpicture/index?selectPicturPath="+imgRes.url
              //       })
              //   },
              //   fail: (err) => {
              //     wx.hideLoading();
              //     xy.showTip(err.msg);
              //   },
              // });
          }
        })
      },
      cam_inited(e){ 
        console.log("cam inited")
      },
      cam_error(){
        console.warn("image-load- error")
      },      
      initCamera(){
        console.warn("initCamera:");
        this.setData({ 
          initCamral: true,
        })   
      },
  methods: { 
  },
  onLoad(){ 
    this.initCamera();
    console.warn("app.sysInfo::",app.sysInfo,wx.getSystemInfoSync(),);
    app.getCurrentLang(this);
  },
  onShow(){ 
    wx.showShareMenu({
      withShareTicket: true, // 是否使用带 shareTicket 的转发
      menus: ["shareAppMessage", "shareTimeline"], // 自定义分享菜单列表
    });
    if (app.globalData.access_token) {
      console.log('app.globalData.subscribe.is_vip', app.globalData.subscribe)
      this.setData({
        notVip: !app.globalData.subscribe.is_vip
      })
    } else {
      app.userCenterLoginCallbackIndex = () => {
        console.log('app.globalData.subscribe.is_vip', app.globalData.subscribe)
        this.setData({
          notVip: !app.globalData.subscribe.is_vip
        })
      };
    }
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { 
  },

  // 返回
  cancelPictureSelect() {
    this.setData({
      showSelectImg:  this.data.showSelectImg?false:true
    })
  },
//   选择照片
takePicture(){
  let tThis= this;
  wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      maxDuration: 30,
      camera: 'back',
      success(res) { 
        // wx.setStorageSync('upload_pic_info', res) 
        // console.warn(res)
        // wx.navigateTo({
        //   url: "/pages/indexpicture/index?selectPicturPath=https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg&height=1200&width=800"
        // })
        // return false;
        tThis.confirmImginfo(res,res.tempFiles[0]['tempFilePath']);
        // tThis.confirmImginfo(res,"https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/1.jpg");
      },
      fail(res) {
        console.warn("cancel_fail::",res)  
      },
      complete(res) { 
        tThis.setData({  
          initCamral:true,
          showSelectImg:  false, 
          selectPicturPath: ""
        });
      },
    })
},  
// 查看原图
viewImage() {
wx.showActionSheet({
  itemList: ["重新上传", "查看大图"],
  success: (e) => {
    this.takePhoto();
    // if (e.tapIndex == 0) {
    //   this.takePhoto();
    // } else if (e.tapIndex == 1) {
    //   wx.previewImage({
    //     urls: [this.data.image_url],
    //     current: this.data.image_url,
    //   });
    // }
  },
  fail: (err) => {
    wx.showToast({ title: err, icon: "none" });
  },
});
},
// 检查图片校验并上传
confirmImginfo(res,uploadPath){
  const tThis=this;
  tThis.setData({ 
      selectPicturPath:uploadPath
  })
  console.log("res.tempFiles[0].size:",res) 
  // return  false;
  wx.showLoading({ title: uploadPath||"翻译中...", mask: false });
  wx.getImageInfo({
    src: uploadPath,
    success (tempinfo) { 
      tThis.setData({  
        ccWidth:tempinfo.width,
        ccHeight:  tempinfo.height, 
      });
      console.log("res.tempinfotempinfo:",tempinfo,uploadPath) 
      wx.showLoading({ title: tempinfo.width||"res.tempinfotempinfo...", mask: false });
      
        xy.checkImageSync({
          tempFilePaths: uploadPath,
          instance: tThis,
          success: (imgRes) => {  
            wx.hideLoading();
            //  imgRes['url']="https://mpss-1321136695.cos.ap-shanghai.myqcloud.com/paper_images/65ee7471bc067/2.jpg"
                  console.warn("takePicture::imgRes::",imgRes)

              tThis.setData({
                selectPicturPath: imgRes.url
              });
              app.globalData.selectPicturPath=imgRes.url;
              wx.getImageInfo({
                src: imgRes.url,
                success (netImginfo) {
                  // tThis.getPictureRate(res); 
                  console.log("getImageInfogetImageInfo:",netImginfo)
                  wx.setStorageSync('upload_pic_info', netImginfo) 
                
                  wx.navigateTo({
                    url: "../indexpicture/index?selectPicturPath="+imgRes.url+"&height="+netImginfo.height+"&width="+netImginfo.width+"&ccheight="+tThis.data.height+"&ccwidth="+tThis.data.width
                  })
                },fail(){
                  app.showModalClose("获取图片信息失败，请重新上传",20000)
                  wx.hideLoading();
                }
              })
          },
          fail: (err) => {
            console.error("checkImageSync::err___");
            wx.hideLoading();
            xy.showTip(err.msg);  
          },
        });
    },fail(){
      app.showModalClose("获取图片信息失败，请重新上传",2000)
      wx.hideLoading()
    }
  })
},
//   选择照片
takePhotoWithMessage(){
    let tThis= this;
    wx.chooseMessageFile({
        count: 1,
        type: "image", 
        success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log("chooseMessageFile:",res)
        tThis.confirmImginfo(res,res.tempFiles[0]['path']);
        // tThis.setData({
        //     selectPicturPath:res.tempFiles[0]['tempFilePath']
        // })
        },
        fail(res) {
          console.warn("cancel_fail::",res)  
          wx.hideLoading()
          app.showModalClose(res,2000)
        },
        complete(res) { 
          wx.hideLoading()
          tThis.setData({  
            initCamral:true,
            showSelectImg:  false, 
            selectPicturPath: ""
          });
        },
    })
}, 
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { 
  },
  textTranslation(){
    wx.navigateTo({
      url: '/pages/main/index',
    })
  },
  imageTranslation() {
    wx.navigateTo({
      url: '/pages/picture/index',
    })
  },
  // 分享内容
  onShareAppMessage: function () {
    return {
      title: "终生免费，无限制。1秒搞定",
      path: "/pages/index/index",
      imageUrl: "/images/index_png.png"
    };
  },
})

