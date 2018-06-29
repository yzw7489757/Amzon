﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.Script.Serialization;

public partial class seller_CreatePropeerties : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void Button1_Click(object sender, EventArgs e)
    {
        System.Text.StringBuilder sbDoc = new System.Text.StringBuilder();
        string dirpro = Server.MapPath("/seller/i18n/zh/");

        string dirjs = Server.MapPath("/seller/lang/cn/");
        DirectoryInfo folder = new DirectoryInfo(dirjs);
        foreach (FileInfo file in folder.GetFiles("*.js"))
        { 
            string js = File.ReadAllText(file.FullName, System.Text.Encoding.UTF8);
            try
            {
                Dictionary<string, object> json = FormatJsonData(js);
                string path = string.Empty;
                System.Text.StringBuilder sbText = new System.Text.StringBuilder();
                DGJson(json, path, ref sbText);
                // 创建文件
                string name = dirpro + System.IO.Path.GetFileNameWithoutExtension(file.FullName) + ".properties";
                if (System.IO.File.Exists(name))
                    System.IO.File.Delete(name);
                FileStream fs = new FileStream(name, FileMode.OpenOrCreate, FileAccess.ReadWrite); //可以指定盘符，也可以指定任意文件名，还可以为word等文件
                StreamWriter sw = new StreamWriter(fs); // 创建写入流
                sw.WriteLine(sbText); // 写入Hello World
                sw.Close(); //关闭文件
            }
            catch {
                sbDoc.AppendLine(System.IO.Path.GetFileName(file.FullName));
            }
        }


        dirpro = Server.MapPath("/seller/i18n/en/");

        dirjs = Server.MapPath("/seller/lang/en/");
        folder = new DirectoryInfo(dirjs);
        foreach (FileInfo file in folder.GetFiles("*.js"))
        {
            string js = File.ReadAllText(file.FullName, System.Text.Encoding.UTF8);
            try
            {
                Dictionary<string, object> json = FormatJsonData(js);
                string path = string.Empty;
                System.Text.StringBuilder sbText = new System.Text.StringBuilder();
                DGJson(json, path, ref sbText);
                // 创建文件
                string name = dirpro + System.IO.Path.GetFileNameWithoutExtension(file.FullName) + ".properties";
                if (System.IO.File.Exists(name))
                    System.IO.File.Delete(name);
                FileStream fs = new FileStream(name, FileMode.OpenOrCreate, FileAccess.ReadWrite); //可以指定盘符，也可以指定任意文件名，还可以为word等文件
                StreamWriter sw = new StreamWriter(fs); // 创建写入流
                sw.WriteLine(sbText); // 写入Hello World
                sw.Close(); //关闭文件
            }
            catch
            {
                sbDoc.AppendLine(System.IO.Path.GetFileName(file.FullName));
            }
        }
        if (sbDoc.Length > 0)
            Response.Write(sbDoc.ToString() + "生成失败");
    }
    private void DGJson(Dictionary<string, object> json, string path, ref System.Text.StringBuilder sbText)
    {
        string keyPath = path;
        foreach (object key in json)
        {
            KeyValuePair<string, object> child = (KeyValuePair<string, object>)key;
            path = keyPath + "_" + child.Key; 

            if (child.Value.GetType().Name.ToLower() == "string")
            {
                sbText.AppendLine(""+path + "=" + child.Value.ToString()); 
            }
            else
            {
                Dictionary<string, object> childValue = (Dictionary<string, object>)child.Value;
                DGJson(childValue, path, ref sbText);
            }
        }
    }
    /// <summary>
    /// 格式化Json数据
    /// </summary>
    /// <param name="jsonText"></param>
    /// <returns></returns>
    private Dictionary<string, object> FormatJsonData(string jsonText)
    {
        JavaScriptSerializer s = new JavaScriptSerializer();
        Dictionary<string, object> JsonData = (Dictionary<string, object>)s.DeserializeObject(jsonText);
        return JsonData;
    }
}